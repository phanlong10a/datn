import { ROLE_PERRMISSiON } from './enum';

export const ROLE_TYPE = {
  ADMIN_MANAGEMENT_LEVEL: 'admin_management_level',
  ROLE_GROUP_LEVEL: 'role_group_level',
  USER_MANAGEMENT_LEVEL: 'user_management_level',
  KYC_MANAGEMENT_LEVEL: 'kyc_management_level',
  GIFT_MANAGEMENT_LEVEL: 'gift_management_level',
  GIFT_RECIVE_MANAGEMENT_LEVEL: 'gift_recive_management_level',
  ENTERPRISE_MANAGEMENT_LEVEL: 'enterprise_management_level',
  ITEM_MANAGEMENT_LEVEL: 'item_management_level',
  REPORT_MANAGEMENT_LEVEL: 'report_management_level',
  SYSTEM_SETTING_LEVEL: 'system_setting_level',
};

export const DEFAULT_DATABASE = {
  SUPER_ADMIN_ACCOUNT: {
    EMAIL: 'admin@gmail.com',
    PASSWORD: '12345678',
    PHONE: '0987654321',
  },
  SUPER_PERMISSIONS: {
    admin_management_level: ROLE_PERRMISSiON.FULL,
    role_group_level: ROLE_PERRMISSiON.FULL,
    user_management_level: ROLE_PERRMISSiON.FULL,
    enterprise_management_level: ROLE_PERRMISSiON.FULL,
    kyc_management_level: ROLE_PERRMISSiON.FULL,
    gift_management_level: ROLE_PERRMISSiON.FULL,
    item_management_level: ROLE_PERRMISSiON.FULL,
    gift_recive_management_level: ROLE_PERRMISSiON.FULL,
    report_management_level: ROLE_PERRMISSiON.FULL,
    system_setting_level: ROLE_PERRMISSiON.FULL,
  },
  SUPER_ROLE: 'SUPER_ADMIN',
};
export const MEET_PARAMETER = {
  meet_time: 5,
  nums_of_scan: 10,
  landing_page_meet_count_bonus: 3,
  meet_count_default: 2,
  locabonus_limit_per_meet: 100,
};

export const release_time = process.env.RELEASE_TIME