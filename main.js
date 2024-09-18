async function getToken() {
    const data = new FormData()

    data.append('username', 79998881122)
    data.append('password', 12345)

    const request_data = {
        method: 'POST',
        body: data
    }

    return await fetch('https://store-demo-test.ru/_admin_login_', request_data)
    .then(response => response.json())
    .then(response => response.access_token)
    .catch(err => console.error(err))
}

function getDatasets(data) {
    console.log(data.finance_planfact)
    let dataset = []
    for (const entry of data.finance_planfact) {  
        dataset.push({date: entry.data, data: entry.revenue})
    }
    return dataset
}



async function getChoosedDate() {
    const startDateEl = document.getElementById('start_date')
    const endDateEl = document.getElementById('end_date')

    const url = new URL('https://store-demo-test.ru/_get_finance_plan_')
    url.searchParams.append('start_date', startDateEl.value)
    url.searchParams.append('end_date', endDateEl.value)
    const headers = new Headers()
    
    headers.append('Authorization', 'Bearer ' + await getToken())

    const request_data = {
        headers: headers
    }

    return await fetch(url, request_data)
    .then(response => response.json())
}

       

async function createChart () {
    const canvasWrapper = document.createElement('div')
    const canvas = document.createElement('canvas')
    canvasWrapper.appendChild(canvas)

    const raw_data = await getChoosedDate()
    const data = getDatasets(raw_data)
    new Chart(canvas, 
        {type: 'bar', 
            data: {
                labels: data.map(row => row.date),
                datasets: [
                    {
                        label: 'Revenue by day',
                        data: data.map(row => row.data)
                    }
                ]
            }}
        )
    chartWrapper = document.getElementById('chart_wrapper')
    if (chartWrapper.childen) {
        chartWrapper.childen[0].remove
    } 

    chartWrapper.replaceChildren(canvasWrapper)

}


const submitButton = document.getElementById('submit_button') 

submitButton.addEventListener('click', createChart)