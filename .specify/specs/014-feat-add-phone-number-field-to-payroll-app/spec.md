# Feature: Add Phone number field to payroll app

> Issue: #14
> Status: Draft

## Problem Statement

The payroll app currently stores employee compensation, reporting lines, and home addresses, but it does not provide a way to record a phone number for each employee. Payroll administrators need quick access to employee phone numbers so they can contact employees during urgent or emergency situations without relying on separate systems or offline records.

Adding phone number capture to the payroll app keeps employee contact details in the same place as the rest of each payroll profile and reduces the risk of missing or outdated emergency contact information.

## User Stories

1. As a payroll admin, I want to enter an employee phone number when creating a payroll profile, so that I can store their primary contact number from the start.
2. As a payroll admin, I want to update an employee phone number later, so that I can keep contact information accurate over time.
3. As a payroll admin, I want to view the stored phone number within the payroll app, so that I can quickly find how to contact an employee in an emergency.

## Functional Requirements

### Must Have

- [ ] **Phone field on create**: The add-employee workflow includes a phone number field labeled `Phone`
- [ ] **Phone field on update**: Existing employee records can be edited to add or change the stored phone number
- [ ] **Phone value persistence**: The employee record stores the phone number as part of the payroll profile and retains it across page reloads and app restarts
- [ ] **Validation**: The app rejects phone numbers that exceed 10 digits
- [ ] **Validation feedback**: When a phone number is rejected, the payroll admin receives a clear message explaining the validation failure
- [ ] **Visibility**: Stored phone numbers are shown in the payroll app wherever employee contact details are managed so admins can reference them after saving

### Should Have

- [ ] **Graceful handling of existing records**: Existing employee records without a phone number continue to load and remain editable
- [ ] **Consistent presentation**: The app presents phone numbers consistently wherever they are displayed in the interface

### Nice to Have

- [ ] **Searchability**: Payroll admins can search or filter employees by phone number
- [ ] **Copy-friendly display**: Displayed phone numbers are easy to copy for calling or texting workflows

## Acceptance Criteria

- [ ] Verify the add employee form includes a `Phone` field
- [ ] Verify each employee edit form includes a `Phone` field populated with the current saved value, when present
- [ ] Verify a payroll admin can save a valid phone number and see it later in the payroll app
- [ ] Verify a payroll admin can update an existing employee phone number
- [ ] Verify the approved optional-or-required behavior for blank phone values is enforced consistently for new and existing records
- [ ] Verify submitting a phone number longer than 10 digits does not save the change and shows a clear validation message
- [ ] Verify existing employee records created before this feature still render successfully

## Out of Scope

The following are explicitly not part of this feature:

- Separate emergency contact people or alternate phone numbers
- International phone number support, extensions, or country-code handling
- SMS, calling, or notification integrations
- Phone number verification through third-party services
- Bulk import or export of phone numbers

## Open Questions

1. Should the phone number be required for new employees, or should it remain optional?
2. Should the app accept only digits, or should it also allow formatting characters such as spaces, dashes, or parentheses as long as the total digit count does not exceed 10?
3. Where should the saved phone number be visible after entry: only in employee forms, in the roster table, in API responses, or all of the above?
4. For existing employee records that already exist without phone numbers, should the field remain blank until manually filled in, or is any backfill/default behavior expected?
