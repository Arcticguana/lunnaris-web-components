class DatePicker {
    constructor(day, month, year){
        this.day = day;
        this.month = month;
        this.year = year;
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'];
        this.week = ['Mon','Tues','Wed','Thur','Fri','Sat','Sun'];
        this.selectedYear = null;
        this.selectedMonth = null;
        this.selectedDay = null;
        this.monthDays = null;
        this.onchange = null;
    }

    render(){
        var root = document.createElement('div');
        root.className = "date-picker";

        var selector = document.createElement('div');
        selector.className = "selector-pane";

        root.appendChild(selector);

        var monthPane = document.createElement('div');
        monthPane.className = "month-pane";

        selector.appendChild(monthPane);

        var leftArrow = document.createElement('button')
        leftArrow.className = "left-arrow-btn";
        leftArrow.textContent = '<';
        leftArrow.addEventListener('click', () => {
            this.selectPrevMont();
        })

        var rightArrow = document.createElement('button');
        rightArrow.className = "right-arrow-btn";
        rightArrow.textContent = ">";
        rightArrow.addEventListener('click', () => {
            this.selectNextMonth();
        });

        var monthSelector = document.createElement('div');
        monthSelector.className = "month-selector";

        monthPane.appendChild(leftArrow);
        monthPane.appendChild(monthSelector);
        monthPane.appendChild(rightArrow);
        

        var selectedMonth = document.createElement('label');
        selectedMonth.className = 'selected-item';
        selectedMonth.textContent = this.months[this.month-1];
        this.selectedMonth = selectedMonth;

        monthSelector.appendChild(selectedMonth);

        var monthList = document.createElement('nav');
        monthList.className = 'month-list';

        monthSelector.appendChild(monthList);

        this.months.forEach((elem, index) => {
            let mnth = document.createElement('li');
            mnth.className = 'month-item';
            mnth.textContent = elem;
            mnth.addEventListener('click',() => {
                this.selectMonth(index + 1);

            })
            monthList.appendChild(mnth);
        })

        var yearSelector = document.createElement('div');
        yearSelector.className = 'year-pane';

        var leftArrow1 = document.createElement('button')
        leftArrow1.className = "left-arrow-btn";
        leftArrow1.textContent = '<';
        leftArrow1.addEventListener('click', () => {
            this.selectPrevYear()
        })

        var rightArrow1 = document.createElement('button');
        rightArrow1.className = "right-arrow-btn";
        rightArrow1.textContent = ">";
        rightArrow1.addEventListener('click', () => {
            this.selectNextYear();
        });

        var selectedYear = document.createElement('label');
        selectedYear.className = 'selected-item';
        selectedYear.textContent = `${this.year}`;
        this.selectedYear = selectedYear;

        yearSelector.appendChild(leftArrow1);
        yearSelector.appendChild(selectedYear);
        yearSelector.appendChild(rightArrow1);

        selector.appendChild(yearSelector);

        var daysPanel = document.createElement('div');
        daysPanel.className = 'days-panel';

        root.appendChild(daysPanel);

        var daysNames = document.createElement('div');
        daysNames.className = 'names';

        daysPanel.appendChild(daysNames);

        this.week.forEach((elem) => {
            let mnth = document.createElement('li');
            mnth.className = 'day-name';
            mnth.innerHTML = '<strong>' + elem + '</strong>';
            //mnth.textContent = '<strong>' + elem + '<strong>';
            daysNames.appendChild(mnth);
        })

        

        var monthDays = document.createElement('div');
        monthDays.className = 'month-days';

        daysPanel.appendChild(monthDays);
        this.monthDays = monthDays;

        this.fillDays();
        /*
        for(var i = 0; i < 30; i++){
            let temp = document.createElement('div');
            temp.className = 'day-cell';
            if(i === this.day){
                temp.classList.toggle('selected', true);
            }
            temp.textContent = '' + i;
            monthDays.appendChild(temp);
        }*/

        return root;

    }

    createDayCell(num){
        let temp = document.createElement('div');
        temp.className = 'day-cell';
        if(num === this.day){
            temp.classList.toggle('selected', true);
            this.selectedDay = temp;
        }
        temp.textContent = '' + num;
        temp.addEventListener('click', () => {
            this.selectDay(temp, num);
        });

        return temp;
    }

    selectDay(element, day){
        this.day = day;
        if( this.selectedDay !== null){
            this.selectedDay.classList.toggle('selected', false);
        }
        this.selectedDay = element;
        this.selectedDay.classList.toggle('selected', true);
        if(this.onchange !== null){
            this.onchange();
        }
    }

    selectMonth(month) {
        this.month = month;
        this.selectedMonth.textContent = this.months[this.month - 1];
        this.triggerUpdate();
    }

    selectNextMonth(){
        this.month += 1;
        if(this.month > 12){
            this.month = 1;
            this.year += 1;
            this.selectedYear.textContent = '' + this.year;
        }
        this.selectedMonth.textContent = this.months[this.month - 1];
        this.triggerUpdate();
    }

    selectPrevMont() {
        this.month -= 1;
        if(this.month < 1){
            this.month = 12;
            this.year -= 1;
            this.selectedYear.textContent = '' + this.year;
        }
        this.selectedMonth.textContent = this.months[this.month - 1];
        this.triggerUpdate();
    }

    selectNextYear(){
        this.year += 1;
        this.selectedYear.textContent = '' + this.year;
        this.triggerUpdate();
    }

    selectPrevYear(){
        this.year -= 1;
        this.selectedYear.textContent = '' + this.year;
        this.triggerUpdate();
    }

    triggerUpdate(){
        this.fillDays();
        if(this.onchange !== null){
            this.onchange();
        }

    }

    fillDays(){
        this.monthDays.innerHTML = '';
        var date = new Date(this.year, this.month-1, 1);
        var weekDay = date.getDay();
        
        for(var i = 0; i < weekDay-1; i++){
            let cell = document.createElement('span')
            this.monthDays.appendChild(cell);
        }

        var daysOfMonth = new Date(this.year, this.month, 0);

        for(var i = 1; i <= daysOfMonth.getDate(); i++) {
            this.monthDays.appendChild(this.createDayCell(i));
        }
        
    }

    asString(){
        return `${this.day}/${this.month}/${this.year}`
    }
}
