let currentDay, currentMonth, currentYear,
    inputDayValue, inputMonthValue, inputYearValue,
    ageYears, ageMonths, ageDays,
    leapYearCount, date, dateIsGood;

let monthDayCount = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

function submitForm() {
    processInput();
}

function processInput() {
    // get values
    getValues();
    
    // if inputted date is empty
    dateIsGood = true;
    checkInput(inputDayValue, 'label-birthDay', 'birthDay', 'error-day');
    checkInput(inputMonthValue, 'label-birthMonth', 'birthMonth', 'error-month');
    checkInput(inputYearValue, 'label-birthYear', 'birthYear', 'error-year');

    if( dateIsGood ) {
        computeAge(inputDayValue, inputMonthValue, inputYearValue );
    }
}

function getValues() {
    // current date values
    date = new Date();
    currentDay = date.getDate();
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    // input values
    inputDayValue = parseInt(document.getElementById('birthDay').value);
    inputMonthValue = parseInt(document.getElementById('birthMonth').value);
    inputYearValue = parseInt(document.getElementById('birthYear').value);
}

function checkInput( value, labelID, inputID, errorMsgID ) {
    let color1 = "hsl(0, 1%, 44%)";
    let color2 = "hsl(0, 0%, 8%)";
    let text = "";

    if( isNaN(value) || value == 0 ) { // if blank or null
        color1 = color2 = 'hsl(0, 100%, 67%)';
        text = "This field is required";
    } else if( ( text = isAValidDate( inputID, value ) ) != "" // if date entered is valid
            || ( text = isAFutureDate( inputID ) ) != "" ) { // if date entered is from future
        color1 = color2 = 'hsl(0, 100%, 67%)';
    }

    if( text != "" ) {
        dateIsGood = false;
    }

    setElementAttributes( labelID, inputID, errorMsgID, color1, color2, text );
    
}

function isAFutureDate( inputID ) {
    if( inputID == "birthYear"
        && inputYearValue > currentYear) {
        return "A Birth Year from Future";
    } else if( inputID == "birthMonth"
        && ( inputYearValue > currentYear
            || ( inputYearValue == currentYear
                && inputMonthValue > currentMonth + 1 ) )
    ) {
        return "A Birth Month from Future";
    }  else if( inputID == "birthDay"
        && ( inputYearValue > currentYear
            || ( inputYearValue == currentYear
                && inputMonthValue > currentMonth + 1
            )
            || ( inputYearValue == currentYear
                && inputMonthValue == currentMonth + 1
                && inputDayValue > currentDay
            ) 
        )
    ) {
        return "A Birth Day from Future";
    }

    return "";
}

function isAValidDate( inputID, inputValue ) {
    if( inputID == 'birthYear' ) {
        if( isALeapYear(inputValue) == -1 ) {
            return "Must be a Valid Date";
        }
    } else {
        if( !monthDayCount.hasOwnProperty( inputMonthValue ) ) {
            return "Must be a Valid Date";
        }
        else if( inputID == 'birthDay'
                && monthDayCount[ inputMonthValue ] < inputValue ) {       
            return "Must be a Valid Date";
        }
    }
    
    return "";
}

function isALeapYear( yearValue ) {
    if( isNaN( yearValue ) ) {
        return -1;
    }

    if( ( yearValue % 4 == 0
            && yearValue % 10 != 0 )
        || (yearValue % 10 == 0
            && yearValue % 400 == 0) ) {
        monthDayCount[2] = 29;
        return true;
    } else {
        monthDayCount[2] = 28;
        return false;
    }
}

function setElementAttributes( labelID, inputID, errorMsgID, color1, color2, text ) {
    let label = document.getElementById( labelID );
    let input = document.getElementById( inputID );
    let span = document.getElementById( errorMsgID );

    label.setAttribute( 'style', "color: " + color1 + ";" );
    input.setAttribute( 'style', "border-color: " + color2 + ";" );
    input.setAttribute( 'style', "color: " + color2 + ";" );
    span.innerHTML = text;
}

function computeAge( birthDay, birthMonth, birthYear ) {
    monthDayCount[2] = 28;
    let yearDaysCount = arrayValueSum( monthDayCount, 1, 12 );
    let leapYearDaysCount = yearDaysCount + 1;
    totalDays = 0;
    leapYearCount = 0;

    for( let a = birthYear; a <= currentYear; a++ ) {
        let leapYear = isALeapYear(a);
        leapYearCount += (leapYear) ? 1 : 0;

        if( a == birthYear || a == currentYear ) {
            monthDayCount[2] = ( leapYear ) ? 29: 28;
            if(  a == currentYear ) {
                totalDays += arrayValueSum( monthDayCount, 1, currentMonth ) + currentDay;

            } else {
                totalDays += arrayValueSum( monthDayCount, birthMonth, 12 ) - birthDay;
            }
        } else {
            totalDays += ( leapYear ) ? leapYearDaysCount : yearDaysCount;
        }
    }

    ageYears = totalDays / yearDaysCount;
    let remainingDays = totalDays % yearDaysCount;
    ageMonths = remainingDays / 30;
    ageDays = remainingDays % 30;

    document.getElementById( 'age-days' ).innerHTML = parseInt(ageDays);
    document.getElementById( 'age-months' ).innerHTML = parseInt(ageMonths);
    document.getElementById( 'age-years' ).innerHTML = parseInt(ageYears);
    document.getElementById( 'leap-year-count' ).innerHTML = 'Throughout your lifetime, you have experienced the occurrence of <span>' + leapYearCount + ' leap years</span>'
    let bodyClassList = document.getElementsByTagName( 'BODY' )[0].classList;
    bodyClassList.add( 'background-animation' );
}

function arrayValueSum( array, start, end ) {
    let sum = 0;
    for( let a = start; a <= end; a++ ) {
        sum += array[a];
    }
    return sum;
}