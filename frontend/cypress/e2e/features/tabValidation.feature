

Feature: Formbuilder login | Get user role | Validate user module

    Scenario: Login from builder
        Given user login in form builder application
    Scenario Outline: Validate available tabs based on user role
        Then the application should display the correct tabs according to the user's role