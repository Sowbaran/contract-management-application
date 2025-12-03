Feature: Login | New form Ceation | Validate created form

    @sanity
    Scenario: Login from builder
        Given user login in form builder application
    @sanity
    Scenario Outline: Verify created form
        When a new form is created using "<formDetails>"
        Then the form for "<formDetails>" should be successfully created
        Examples:
            | formDetails |
            | testData_01 |