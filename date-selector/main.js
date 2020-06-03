const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const tabsList = ['date-picker','user-input', 'days-of-the-week'];

class DateSelector {
    constructor() {
        this._listEl = document.querySelector('.date-tabs');
        this._submitBtn = document.querySelector('#submit');

        this._activeTab = 'days-of-the-week';

        DateSelector.loadDatePickerValues();
    }

    /**
     * Sets Active tab based on the user click
     * @param e {Event | HTMLElement} - Click event / Element
     */
    setActiveTab(e) {
        const el = e.target || e;

        tabsList.forEach((elName, index) => {
            const block = document.querySelector(`#${elName}`);
            if (el.className === elName) {
                this._activeTab = elName;
                block.classList.remove('hide');

            } else {
                block.classList.add('hide');
            }
        })
    }

    /**
     * Handles the submit button click
     * @param e {Event} - Click event
     */
    handleSubmitClick(e) {
        e.preventDefault();
        let result;
        const resultEl = document.querySelector('#result');

        switch(this._activeTab) {
            case 'days-of-the-week':
                result = this._getWeekOfDays();
                break;
            case 'user-input':
                result = this._getUserInput();

                break;
            case 'date-picker':
                result = this._getDatePickerValue();
                break;
        }

        resultEl.value = result;
        this._setActiveTabAndSelectedValues();
    }

    /**
     * Sets the relevant active tab and value(s) based on given user input
     * @private
     */
    _setActiveTabAndSelectedValues() {
        const result = document.querySelector('#result').value;

        if (result.indexOf('/') === -1) {
            this.setActiveTab(document.getElementsByClassName('days-of-the-week')[0]);
            this._makeCheckBoxSelected(result);

        } else if (result.indexOf('/') !== -1) {
            this.setActiveTab(document.getElementsByClassName('date-picker')[0]);
            this._makeDropdownsSelected();
        }
    }

    /**
     * Makes the relevant checkboxe(s) to be selected based on the given user input
     * @param result {string} - Result string
     * @private
     */
    _makeCheckBoxSelected(result) {
        const checks = document.querySelectorAll('input[type="checkbox"]');

        checks.forEach(check => {
            if (result.indexOf(check.value) !== -1) {
                check.checked = 'checked';
            }
        });
    }

    /**
     * Makes the relevant option values to be selected in the date picker based on the user input
     * @param result {string} - Result string
     * @private
     */
    _makeDropdownsSelected(result) {
        let selectName;

        result.split('/').forEach((dateFragment, key) => {
            dateFragment = parseInt(dateFragment);

            if (key === 0) {
                selectName = 'day';
            } else if (key == 1) {
                selectName = 'month';
            } else {
                selectName = 'year';
            }

            document.querySelector(`#${selectName} > option[value="${dateFragment}"]`).selected = true;
        });
    }

    /**
     * Gets the date picker value
     * @return {string} - date picker value
     * @private
     */
    _getDatePickerValue() {
        const daySelect = document.querySelector('#day');
        const monthSelect = document.querySelector('#month');
        const yearSelect = document.querySelector('#year');
        const day = `${daySelect.value < 10 ? `0${daySelect.value}` : `${daySelect.value}`}`;
        const month = `${monthSelect.value < 10 ? `0${monthSelect.value}` : `${monthSelect.value}`}`;

        return `${day}/${month}/${yearSelect.value}`;
    }

    /**
     * Gets user provided input
     * @return {string}
     * @private
     */
    _getUserInput() {
        const userInput = document.querySelector('#input');
        return userInput.value;
    }

    /**
     * Gets the selected week of days as comma separated string
     * @return {string}
     * @private
     */
    _getWeekOfDays() {
        const checks = document.querySelectorAll('input[type="checkbox"]');
        console.log("checks::");
        console.log(checks);
        let checkedDays = [];
        checks.forEach(check => {
            if (check.checked) {
                checkedDays.push(check.value);
            }
        });

        return checkedDays.join(', ');
    }

    /**
     * Loads the date picker dropdown options
     * @static
     */
    static loadDatePickerValues() {
        const daySelect = document.querySelector('#day');
        const monthSelect = document.querySelector('#month');
        const yearSelect = document.querySelector('#year');
        let days = '';
        let monthOptions = '';

        for(let i = 1; i <= 31; i++) {
            days += `<option value='${i}'>${i}</option>`;
        }

        daySelect.innerHTML += days;

        months.forEach((name, index) => {
            monthOptions += `<option value="${index + 1}">${name}</option>`;
        });

        monthSelect.innerHTML += monthOptions;

        const year = new Date().getFullYear();

        let years = '';
        for (let i = year - 10; i <= year + 10; i++) {
            years += `<option value="${i}">${i}</option>`;
        }

        yearSelect.innerHTML += years;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const datePicker = new DateSelector();

    document.querySelector('#date-tabs').addEventListener(
        'click',
         datePicker.setActiveTab.bind(datePicker)
    );

    document.querySelector('#submit').addEventListener(
        'click',
        datePicker.handleSubmitClick.bind(datePicker)
    );
});

