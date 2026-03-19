const cl = console.log;

const BASE_URL = `https://dummyjson.com`
const TODO_URL = `https://dummyjson.com/todos`

const todoForm = document.getElementById('todoForm')
const todoContainer = document.getElementById('todoContainer')
const todocontrol = document.getElementById('todo')
const userIdcontrol = document.getElementById('userId')
const addtodobtn = document.getElementById('addtodobtn')
const updatetodobtn = document.getElementById('updatetodobtn')

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })

}

//read

function createtodos(arr) {
    let result = '';
    for (let i = arr.length - 1; i >= 0; i--) {
        result += `
            <div class="col-md-4 mb-3" id="${arr[i].id}">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${arr[i].todo}</h5>
                        <p>UserId : ${arr[i].userId}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                            <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                    </div>
                </div>

            </div>`
        todoContainer.innerHTML = result;
    }
}

function fetchBlog() {
    spinner.classList.remove('d-none')
    fetch(TODO_URL, {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token Form LS"
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            cl(data)
            createtodos(data.todos)
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })

}
fetchBlog()

// create 

function ontodosubmit(eve) {
    eve.preventDefault()
    let todo_obj = {
        todo: todocontrol.value,
        completed: false,
        userId: userIdcontrol.value
    }
    let post_url = `${TODO_URL}/add`

    spinner.classList.remove('d-none')
    fetch(post_url, {
        method: 'POST',
        body: JSON.stringify(todo_obj),
        headers: {
            "content-type": "application/json",
            "auth": "Token Form LS"
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            cl(data)
            todoForm.reset()
            let col = document.createElement('div')
            col.className = `col-md-4 mb-4`
            col.id = data.id
            cl(data.id)
            col.innerHTML = `
         <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${data.todo}</h5>
                        <p>UserId : ${data.userId}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                            <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                            <button onclick="onRemove(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                    </div>
                </div>
        `
            todoContainer.prepend(col)
            snackbar(`The  new todo With Id ${data.id} is Added Succefully !!`, 'success')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}

function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-4').id
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/todos/${EDIT_ID}`

    let configobj = {
        method: "GET",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token From LS"
        }
    }

    spinner.classList.remove('d-none')
    fetch(EDIT_URL, configobj)
        .then(res => {
            if (res.ok) {
                return res.json()

            }
        })
        .then(data => {
            todocontrol.value = data.todo
            userIdcontrol.value = data.userId

            updatetodobtn.classList.remove('d-none')
            addtodobtn.classList.add('d-none')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })


}

function ontodoupdate() {
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    let UPDATE_URL = `${BASE_URL}/todos/${UPDATE_ID}`
    let UPDATED_OBJ = {
        todo: todocontrol.value,
        completed: false,
        userId: userIdcontrol.value
    }

    let configobj = {
        method: 'PATCH',
        body: JSON.stringify(UPDATED_OBJ),
        headers: {
            "content-type": "application/json",
            "auth": "Token From LS"
        }
    }

    spinner.classList.remove('d-none')
    fetch(UPDATE_URL, configobj)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            todoForm.reset()
            let col = document.getElementById(UPDATE_ID)
            let h5 = col.querySelector('.card-body h5')
            let p = col.querySelector('.card-body p')
            h5.innerText = data.todo
            p.innerText = data.userId

            updatetodobtn.classList.add('d-none')
            addtodobtn.classList.remove('d-none')
            snackbar(`The New todo with id ${data.id} is Updated Successfully !!! `, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')

        })

}

function onRemove(ele) {
    let REMOVE_ID = ele.closest('.col-md-4').id
    let REMOVE_URL = `${BASE_URL}/todos/${REMOVE_ID}`

    let configobj = {
        method: "DELETE",
        body: null,
        headers: {
            "content-type": "application/json",
            "auth": "Token Form LS"
        }
    }

    Swal.fire({
        title: "Do you want to remove this ?",
        showCancelButton: true,
        confirmButtonText: "REMOVE",
    }).then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none') /

                fetch(REMOVE_URL, configobj)
                    .then(res => {
                        if (res.ok) {
                            return res.json()
                        }
                    })
                    .then(() => {
                        ele.closest('.col-md-4').remove()
                        snackbar(`the todo with id ${REMOVE_ID}is removed successfully !!!`, 'success')

                    })
                    .catch(err => {
                        cl(err)
                    })
                    .finally(() => {
                        spinner.classList.add('d-none')

                    })

        }


    });

}



todoForm.addEventListener('submit', ontodosubmit)
updatetodobtn.addEventListener('click', ontodoupdate)