import db from "../utils/dbconfig.js";
import { sendDiscountPackageAnnouncementSms } from "../utils/sms.js";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAllDiscountPackages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, `package`, amount, start_date, end_date, draft_date, status FROM discount_packages ORDER BY id DESC"
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      start_date: formatDate(row.start_date),
      end_date: formatDate(row.end_date),
      draft_date: formatDate(row.draft_date),
    }));
    res.status(200).json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
};

export const getDiscountPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT id, `package`, amount, start_date, end_date, draft_date, status FROM discount_packages WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    const row = rows[0];

    row.start_date = formatDate(row.start_date);
    row.end_date = formatDate(row.end_date);
    row.draft_date = formatDate(row.draft_date);
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
};

export const createDiscountPackage = async (req, res) => {
  try {
    const {
      package: pkg,
      amount,
      startDate,
      endDate,
      status,
      draft_date,
    } = req.body;
    const [result] = await db.query(
      "INSERT INTO discount_packages (`package`, amount, start_date, end_date, draft_date, status) VALUES (?, ?, ?, ?, ?, ?)",
      [pkg, amount, startDate, endDate, draft_date, status]
    );

    // Notify Basic Plan users about the newly added discount package.
    setImmediate(async () => {
      try {
        const [basicUsers] = await db.query(
          `SELECT id, first_name, contact_no
           FROM customers
           WHERE package_plan = 'Basic Plan' OR package_plan IS NULL OR package_plan = ''`
        );

        if (!basicUsers.length) {
          return;
        }

        const sendResults = await Promise.allSettled(
          basicUsers.map((user) =>
            sendDiscountPackageAnnouncementSms({
              phone: user.contact_no,
              firstName: user.first_name,
              packageName: pkg,
              amount,
              startDate,
              endDate,
            })
          )
        );

        const sentCount = sendResults.filter(
          (resultItem) =>
            resultItem.status === "fulfilled" && resultItem.value?.success
        ).length;

        console.log(
          `Discount package SMS broadcast completed: ${sentCount}/${basicUsers.length} sent`
        );
      } catch (smsError) {
        console.error("Failed to broadcast discount package SMS:", smsError);
      }
    });

    res.status(201).json({
      id: result.insertId,
      package: pkg,
      amount,
      startDate,
      endDate,
      draft_date,
      status,
    });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
};

export const updateDiscountPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      package: pkg,
      amount,
      startDate,
      endDate,
      status,
      draft_date,
    } = req.body;
    await db.query(
      "UPDATE discount_packages SET `package`=?, amount=?, start_date=?, end_date=?, draft_date=?, status=? WHERE id=?",
      [pkg, amount, startDate, endDate, draft_date, status, id]
    );
    res
      .status(200)
      .json({
        id,
        package: pkg,
        amount,
        startDate,
        endDate,
        draft_date,
        status,
      });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
};

export const deleteDiscountPackage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM discount_packages WHERE id = ?", [id]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error });
  }
};
