class SearchWidget extends HTMLElement {
    constructor() {
        super();
        this.cities = [];
    }

    connectedCallback() {
        this.render();
    }

    set cities(value) {
        this._cities = value;
        this.render();
    }

    get cities() {
        return this._cities;
    }

    render() {
        this.innerHTML = `
            <div class="search-widget">
                <select id="startCity">
                    <option value="">Выберите начальный город</option>
                    ${this.cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                </select>

                <select id="endCity">
                    <option value="">Выберите конечный город</option>
                    ${this.cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                </select>

                <input type="date" id="startDate" min="${this.getToday()}">
                <input type="date" id="endDate" disabled>

                <label><input type="checkbox" id="toggleEndDate"> Только начальная дата</label>

                <button id="searchButton">Поиск</button>
                <div id="error" class="error"></div>
            </div>
        `;

        this.querySelector('#toggleEndDate').addEventListener('change', this.toggleEndDate.bind(this));
        this.querySelector('#searchButton').addEventListener('click', this.search.bind(this));
    }

    getToday() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    toggleEndDate(e) {
        const endDateInput = this.querySelector('#endDate');
        endDateInput.disabled = e.target.checked;
    }

    search() {
        const startCity = this.querySelector('#startCity').value;
        const endCity = this.querySelector('#endCity').value;
        const startDate = this.querySelector('#startDate').value;
        const endDate = this.querySelector('#endDate').value;
        const errorDiv = this.querySelector('#error');

        if (!startCity || !endCity || !startDate || (!endDate && !this.querySelector('#toggleEndDate').checked)) {
            errorDiv.textContent = 'Пожалуйста, заполните все необходимые поля.';
            return;
        }

        errorDiv.textContent = '';
        this.dispatchEvent(new CustomEvent('search', {
            detail: { startCity, endCity, startDate, endDate }
        }));
    }
}

customElements.define('search-widget', SearchWidget);
