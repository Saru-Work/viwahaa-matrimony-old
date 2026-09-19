const DEFAULT_TIMEOUT_MS = Number(process.env.QUICKSEND_TIMEOUT_MS || 10000);
const DEFAULT_INSTALLMENT_DAYS = Number(
  process.env.QUICKSEND_INSTALLMENT_DUE_DAYS || 30
);

const sanitizePhone = (phone) => String(phone || "").replace(/\D/g, "");

const formatPhoneForQuickSend = (phone) => {
  const cleaned = sanitizePhone(phone);

  // If number is in Sri Lankan international format, convert to local style.
  if (cleaned.startsWith("94") && cleaned.length >= 11) {
    return cleaned.slice(2);
  }

  return cleaned;
};

const buildMessage = ({ firstName, memberId }) => {
  const safeName = firstName?.trim() || "User";
  return `Hi ${safeName}, your account creation is successful. Member ID: ${memberId}. - Viwahaa`;
};

const parseGatewayResponse = async (response) => {
  const raw = await response.text();

  try {
    return { raw, parsed: JSON.parse(raw) };
  } catch {
    return { raw, parsed: null };
  }
};

const formatDisplayDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-CA");
};

const getNextInstallmentDate = (startDate) => {
  const base = startDate ? new Date(startDate) : new Date();
  if (Number.isNaN(base.getTime())) return null;

  base.setDate(base.getDate() + DEFAULT_INSTALLMENT_DAYS);
  return formatDisplayDate(base);
};

const normalizePackageName = (value) => String(value || "").trim().toLowerCase();

const isUltimatePlan = (value) => normalizePackageName(value) === "ultimate plan";

const isPremiumPlan = (value) => normalizePackageName(value) === "premium plan";

const sendQuickSendSms = async ({ phone, message, baseUrl, email, apiKey, senderId }) => {
  const formattedPhone = formatPhoneForQuickSend(phone);

  const params = new URLSearchParams({
    FUN: "SEND_SINGLE",
    with_get: "true",
    un: email,
    up: apiKey,
    senderID: senderId,
    msg: message,
    to: formattedPhone,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const method = (process.env.QUICKSEND_METHOD || "POST").toUpperCase();
    const finalUrl = `${baseUrl}?${params.toString()}`;

    const response = await fetch(finalUrl, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    const gatewayResponse = await parseGatewayResponse(response);

    const raw = (gatewayResponse.raw || "").toLowerCase();
    const parsedStatus =
      gatewayResponse.parsed && typeof gatewayResponse.parsed === "object"
        ? String(gatewayResponse.parsed.status || "").toLowerCase()
        : "";

    const acceptedByGateway =
      response.ok &&
      (parsedStatus === "success" ||
        raw.includes("success") ||
        raw.includes("queued") ||
        raw.includes("sent"));

    return {
      success: acceptedByGateway,
      status: response.status,
      request: {
        endpoint: baseUrl,
        method,
        to: formattedPhone,
        senderId,
      },
      response: gatewayResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "SMS send failed",
    };
  } finally {
    clearTimeout(timeout);
  }
};

const resolveGatewayConfig = () => {
  const baseUrl = process.env.QUICKSEND_BASE_URL;
  const senderId = process.env.QUICKSEND_SENDER_ID;
  const email = process.env.QUICKSEND_EMAIL;
  const apiKey = process.env.QUICKSEND_API_KEY;

  if (!baseUrl || !senderId || !email || !apiKey) {
    return {
      ok: false,
      response: {
        success: false,
        skipped: true,
        reason: "Missing QuickSend environment configuration",
      },
    };
  }

  return { ok: true, baseUrl, senderId, email, apiKey };
};

export const sendRegistrationSms = async ({ phone, firstName, memberId }) => {
  const enabled = (process.env.QUICKSEND_ENABLED || "true").toLowerCase() === "true";
  if (!enabled) {
    return { success: false, skipped: true, reason: "QUICKSEND_ENABLED is false" };
  }

  const gateway = resolveGatewayConfig();
  if (!gateway.ok) {
    return gateway.response;
  }

  const mobile = sanitizePhone(phone);
  if (!mobile) {
    return { success: false, skipped: true, reason: "Invalid phone number" };
  }

  const message = buildMessage({ firstName, memberId });
  return sendQuickSendSms({
    phone: mobile,
    message,
    baseUrl: gateway.baseUrl,
    email: gateway.email,
    apiKey: gateway.apiKey,
    senderId: gateway.senderId,
  });
};

export const sendPackageUpgradeSms = async ({
  phone,
  firstName,
  packageName,
  expiryDate,
  payType,
  remainingBalance,
  nextInstallmentDate,
}) => {
  const enabled = (process.env.QUICKSEND_ENABLED || "true").toLowerCase() === "true";
  if (!enabled) {
    return { success: false, skipped: true, reason: "QUICKSEND_ENABLED is false" };
  }

  const gateway = resolveGatewayConfig();
  if (!gateway.ok) {
    return gateway.response;
  }

  const mobile = sanitizePhone(phone);
  if (!mobile) {
    return { success: false, skipped: true, reason: "Invalid phone number" };
  }

  const customerName = firstName?.trim() || "Customer";
  const planName = packageName || "Premium Plan";

  let validUntil = formatDisplayDate(expiryDate) || "as per your package duration";
  if (isUltimatePlan(planName)) {
    validUntil = "until further notice";
  }
  if (isPremiumPlan(planName) && !formatDisplayDate(expiryDate)) {
    validUntil = "for 18 months from approval";
  }

  let message = `Hi ${customerName}. Thank you for your subscription. Your plan has been upgraded to ${planName}. It will be valid until ${validUntil}.`;

  // Only Ultimate Plan supports installments.
  if (isUltimatePlan(planName) && String(payType || "").toLowerCase() === "installment") {
    const balance = Number(remainingBalance || 0);
    const dueDate = getNextInstallmentDate(nextInstallmentDate || new Date());
    if (balance > 0) {
      message += ` Installment payment selected. Remaining amount: Rs.${balance.toFixed(
        2
      )}. Next installment date: ${dueDate || "please contact support"}.`;
    }
  }

  return sendQuickSendSms({
    phone: mobile,
    message,
    baseUrl: gateway.baseUrl,
    email: gateway.email,
    apiKey: gateway.apiKey,
    senderId: gateway.senderId,
  });
};

export const sendPaymentSettledSms = async ({
  phone,
  firstName,
  packageName,
  settledAmount,
  paidDate,
}) => {
  const enabled = (process.env.QUICKSEND_ENABLED || "true").toLowerCase() === "true";
  if (!enabled) {
    return { success: false, skipped: true, reason: "QUICKSEND_ENABLED is false" };
  }

  const gateway = resolveGatewayConfig();
  if (!gateway.ok) {
    return gateway.response;
  }

  const mobile = sanitizePhone(phone);
  if (!mobile) {
    return { success: false, skipped: true, reason: "Invalid phone number" };
  }

  const customerName = firstName?.trim() || "Customer";
  const planName = packageName || "your selected plan";
  const amount = Number(settledAmount || 0);
  const paidOn = formatDisplayDate(paidDate || new Date()) || "today";

  const amountText = amount > 0 ? ` Amount settled: Rs.${amount.toFixed(2)}.` : "";
  const message = `Hi ${customerName}. Your payment has been settled for ${planName}.${amountText} Paid on: ${paidOn}. Thank you.`;

  return sendQuickSendSms({
    phone: mobile,
    message,
    baseUrl: gateway.baseUrl,
    email: gateway.email,
    apiKey: gateway.apiKey,
    senderId: gateway.senderId,
  });
};

export const sendDiscountPackageAnnouncementSms = async ({
  phone,
  firstName,
  packageName,
  amount,
  startDate,
  endDate,
}) => {
  const enabled = (process.env.QUICKSEND_ENABLED || "true").toLowerCase() === "true";
  const discountAlertsEnabled =
    (process.env.QUICKSEND_DISCOUNT_ALERT_ENABLED || "true").toLowerCase() ===
    "true";

  if (!enabled || !discountAlertsEnabled) {
    return {
      success: false,
      skipped: true,
      reason: "Discount alert SMS is disabled",
    };
  }

  const gateway = resolveGatewayConfig();
  if (!gateway.ok) {
    return gateway.response;
  }

  const mobile = sanitizePhone(phone);
  if (!mobile) {
    return { success: false, skipped: true, reason: "Invalid phone number" };
  }

  const customerName = firstName?.trim() || "Customer";
  const discountName = packageName || "special package";
  const displayAmount = Number(amount || 0);
  const fromDate = formatDisplayDate(startDate) || "today";
  const toDate = formatDisplayDate(endDate) || "limited period";

  const amountText =
    displayAmount > 0 ? ` for Rs.${displayAmount.toFixed(2)}` : "";

  const message = `Hi ${customerName}. New offer available: ${discountName}${amountText}. Valid from ${fromDate} to ${toDate}. Contact Viwahaa to activate your plan.`;

  return sendQuickSendSms({
    phone: mobile,
    message,
    baseUrl: gateway.baseUrl,
    email: gateway.email,
    apiKey: gateway.apiKey,
    senderId: gateway.senderId,
  });
};
