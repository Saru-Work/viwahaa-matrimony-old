-- CreateTable
CREATE TABLE `access_models` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `access_model` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access_points` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(255) NOT NULL,
    `access_model_id` BIGINT UNSIGNED NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `access_points_access_model_id_foreign`(`access_model_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booked_packages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `package` VARCHAR(255) NOT NULL,
    `pay_type` VARCHAR(255) NOT NULL,
    `amount` VARCHAR(255) NOT NULL,
    `install_amount` VARCHAR(255) NOT NULL,
    `balance` VARCHAR(255) NOT NULL,
    `income` VARCHAR(255) NOT NULL,
    `recipt_img` VARCHAR(255) NULL,
    `exp_date` DATE NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `d_o_b` DATE NOT NULL,
    `age` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `contact_no` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `whatsapp_no` VARCHAR(255) NULL,
    `birth_place` VARCHAR(255) NULL,
    `birth_time` VARCHAR(255) NULL,
    `height` VARCHAR(255) NULL,
    `weight` VARCHAR(255) NULL,
    `complexion` VARCHAR(255) NULL,
    `maritial_status` TEXT NULL,
    `physical_status` VARCHAR(255) NULL,
    `religion` VARCHAR(255) NULL,
    `cast` TEXT NULL,
    `star_sign` VARCHAR(255) NULL,
    `rasi` TEXT NULL,
    `chart_img` VARCHAR(255) NULL,
    `profile_img` VARCHAR(255) NULL,
    `img_1` TEXT NULL,
    `img_2` TEXT NULL,
    `country_of_birth` TEXT NULL,
    `city_of_birth` TEXT NULL,
    `country_of_resident` TEXT NULL,
    `city_of_resident` TEXT NULL,
    `country_of_citizenship` TEXT NULL,
    `eating_habit` TEXT NULL,
    `smoking_habit` TEXT NULL,
    `drinking_habit` TEXT NULL,
    `primary_school` VARCHAR(255) NULL,
    `secondary_school` VARCHAR(255) NULL,
    `education` VARCHAR(255) NULL,
    `education_details` TEXT NULL,
    `occupation` VARCHAR(255) NULL,
    `occupation_details` TEXT NULL,
    `employed_in` VARCHAR(255) NULL,
    `annual_income` VARCHAR(255) NULL,
    `family_value` VARCHAR(255) NULL,
    `family_type` VARCHAR(255) NULL,
    `family_status` VARCHAR(255) NULL,
    `fathers_name` VARCHAR(255) NULL,
    `fathers_occupation` VARCHAR(255) NULL,
    `fathers_native_place` VARCHAR(255) NULL,
    `mothers_name` VARCHAR(255) NULL,
    `mothers_occupation` VARCHAR(255) NULL,
    `mothers_native_place` VARCHAR(255) NULL,
    `brothers` VARCHAR(255) NULL,
    `married_brothers` VARCHAR(255) NULL,
    `sisters` VARCHAR(255) NULL,
    `married_sisters` VARCHAR(255) NULL,
    `more_family` TEXT NULL,
    `partner_country_of_resident` VARCHAR(255) NULL,
    `partner_resident_status` VARCHAR(255) NULL,
    `partner_education` VARCHAR(255) NULL,
    `partner_occupation` VARCHAR(255) NULL,
    `partner_annual_income` VARCHAR(255) NULL,
    `partner_marital_status` VARCHAR(255) NULL,
    `partner_minimum_age` VARCHAR(255) NULL,
    `partner_maximum_age` VARCHAR(255) NULL,
    `partner_minimum_height` VARCHAR(255) NULL,
    `partner_maximum_height` VARCHAR(255) NULL,
    `partner_physical_status` VARCHAR(255) NULL,
    `partner_mother_tongue` VARCHAR(255) NULL,
    `partner_religion` VARCHAR(255) NULL,
    `partner_star_sign` VARCHAR(255) NULL,
    `partner_cast` VARCHAR(255) NULL,
    `partner_eating_habit` VARCHAR(255) NULL,
    `partner_smoking_habit` VARCHAR(255) NULL,
    `partner_drinking_habit` VARCHAR(255) NULL,
    `package_plan` VARCHAR(255) NOT NULL DEFAULT 'Basic Plan',
    `image_private` BOOLEAN NULL,
    `contact_private` BOOLEAN NULL,
    `chart_private` BOOLEAN NULL,
    `status` VARCHAR(50) NULL DEFAULT 'single',
    `sevvay_thoosam` VARCHAR(50) NULL DEFAULT 'no',
    `sevvay_thoosam_position` VARCHAR(255) NULL,
    `last_seen` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `default_profile_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `religion_id` INTEGER NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `religion_id`(`religion_id`),
    UNIQUE INDEX `uq_gen_rel`(`gender`, `religion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package` VARCHAR(255) NOT NULL,
    `amount` VARCHAR(255) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `draft_date` DATE NULL,
    `status` VARCHAR(50) NULL DEFAULT 'Draft',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_path` VARCHAR(500) NOT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `is_active` BOOLEAN NULL DEFAULT true,
    `position_y` INTEGER NULL DEFAULT 50,
    `zoom` DECIMAL(3, 1) NULL DEFAULT 1.0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interested_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `profile_id` INTEGER NOT NULL,
    `is_read` TINYINT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `notification_type` VARCHAR(50) NULL DEFAULT 'interest',

    INDEX `idx_user_id`(`user_id`),
    INDEX `idx_profile_id`(`profile_id`),
    UNIQUE INDEX `unique_notification`(`user_id`, `profile_id`, `notification_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `intresteds` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` VARCHAR(255) NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `seen` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_type_id` BIGINT UNSIGNED NOT NULL,
    `permission` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `permissions_user_type_id_foreign`(`user_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_intresteds` (
    `id` BIGINT UNSIGNED NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `mem_id` VARCHAR(255) NOT NULL,
    `profile_name` VARCHAR(255) NOT NULL,
    `profile_mem_id` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `religions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sample_data` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(255) NOT NULL,
    `setting_value` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `setting_key`(`setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `success_stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partner1_name` VARCHAR(255) NOT NULL DEFAULT '',
    `partner2_name` VARCHAR(255) NOT NULL DEFAULT '',
    `quote` TEXT NULL,
    `marriage_month` VARCHAR(50) NULL,
    `marriage_year` VARCHAR(10) NULL,
    `location` VARCHAR(255) NULL,
    `photo` VARCHAR(500) NULL,
    `status` ENUM('Published', 'Draft') NOT NULL DEFAULT 'Published',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_types` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_type` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `tp` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `user_type_id` BIGINT UNSIGNED NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    INDEX `users_user_type_id_foreign`(`user_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedding_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `couple_name` VARCHAR(255) NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access_points` ADD CONSTRAINT `access_points_access_model_id_foreign` FOREIGN KEY (`access_model_id`) REFERENCES `access_models`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `default_profile_images` ADD CONSTRAINT `default_profile_images_ibfk_1` FOREIGN KEY (`religion_id`) REFERENCES `religions`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `interested_profiles` ADD CONSTRAINT `interested_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interested_profiles` ADD CONSTRAINT `interested_profiles_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_user_type_id_foreign` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_foreign` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
