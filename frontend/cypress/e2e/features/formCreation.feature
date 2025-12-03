

Feature: Formbuilder login | create new form | validate created form

    Scenario: Login from builder
        Given user login in form builder application
    Scenario Outline: Verify created form
        When a new form is created using "<formDetails>"
        Then the form for "<formDetails>" should be successfully created
        Examples:
            | formDetails |
            | testData_01 |
            | testData_02 |
            | testData_03 |
