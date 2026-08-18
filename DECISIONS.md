# Architecture & Product Decisions

## 1. Configuration Source of Truth

Estimator configuration is stored in MongoDB.

This allows the owner to update questions, labels, options, pricing and modifiers without modifying frontend source code or redeploying the application.

The public estimator retrieves the configuration through the backend API.

## 2. Server-Side Calculation

Estimate calculations are performed on the backend.

The browser submits the customer's answers, while the server retrieves the pricing configuration and calculates the estimate.

This keeps the server as the source of truth for pricing and calculation.

## 3. Owner Authentication

JWT authentication is used for the owner dashboard.

The frontend sends the JWT with protected API requests.

The backend independently verifies the JWT before allowing access to protected owner endpoints.

## 4. Database

MongoDB was selected for storing estimator configuration, owner information and captured leads.

The configuration structure contains business information, questions, options, pricing and modifiers.

## 5. Dynamic Estimator

Estimator questions and options are rendered from API configuration instead of being hardcoded in the React frontend.

This allows the owner to change the estimator from the dashboard.

## 6. Configuration Updates

Configuration updates are handled through:

PUT /api/owner/config

The updated configuration is persisted in MongoDB.

The public estimator can then consume the updated configuration without requiring a frontend redeployment.

## 7. Lead Capture

Customer information and the generated estimate are stored as leads after the estimator is completed.

The owner can view captured leads through the protected dashboard.

## 8. Scope Decisions

The main priority was completing the required estimator, lead capture, authentication, owner dashboard and dynamic configuration functionality.

Optional features such as CSV export, webhooks, configuration history and advanced analytics were not prioritized because they were outside the core implementation scope.

## 9. Questions for Dale

1. Should owner configuration changes require approval before becoming public?
2. Should leads have statuses such as New, Contacted and Closed?
3. Should configuration changes have an audit history?
4. Should owners be able to create completely new question types?
5. Should leads be exportable as CSV?

## 10. Future Improvements

With additional development time, I would add:

- Lead status management
- CSV export
- Configuration version history
- Audit logging
- Automated calculation tests
- More robust configuration validation
- Additional estimator question types
