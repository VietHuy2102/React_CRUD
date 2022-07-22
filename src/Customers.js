import React from "react";

class Customers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: [],
            action: "list",
            form: {
                id: 1,
                name: "",
                email: "",
                phone: ""
            },
            errors: {},
            msg: ""
        }
        this.customerAPI = "http://localhost:3004/customers"
    }

    getUsers = () => {
        fetch(this.customerAPI)
            .then(response => response.json())
            .then(customers => {
                this.setState({
                        customers: customers
                    }
                )
            })
    }


    componentDidMount() {
        this.getUsers()

    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     this.getUsers()
    // }

    customerRender = () => {
        return this.state.customers.map((customer, index) => {
            return (
                <tr key={customer.id}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                        <a href="#" className="btn btn-warning btn-sm" onClick={(e) => {
                            e.preventDefault();
                            this.handleAction("update")
                            this.fillForm(e);
                        }} data-id={customer.id}>Sửa</a>

                    </td>
                    <td><a href="#" data-id={customer.id} className="btn btn-danger btn-sm"
                           onClick={this.deleteCustomer}>Xóa</a></td>
                </tr>
            )
        })

    }

    renderAction = () => {
        let jsx;
        switch (this.state.action) {
            case "add":
                jsx = <>
                    <h1>Thêm Khách Hàng</h1>
                    <button className="btn btn-primary" type="button" onClick={() => {
                        this.handleAction("list")
                    }}>Quay lại
                    </button>
                    <hr/>
                    {
                        this.state.msg !== "" ?
                            <div className="alert alert-danger text-center">{this.state.msg}</div> : false
                    }
                    <form onSubmit={this.handleAddSubmit}>
                        <div className="mb-3">
                            <label>Tên</label>
                            <input type="text" className="form-control" placeholder="Tên..."
                                   name="name" value={this.state.form.name}
                                   onChange={this.changValue}/>
                            {
                                this.state.errors.name ?
                                    <span style={{color: "red"}}>{this.state.errors.name}</span> : false
                            }
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Email..."
                                   name="email" value={this.state.form.email} onChange={this.changValue}/>
                            {
                                this.state.errors.email ?
                                    <span style={{color: "red"}}>{this.state.errors.email}</span> : false
                            }
                        </div>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input type="text" className="form-control" placeholder="Điện thoại..."
                                   name="phone" value={this.state.form.phone} onChange={this.changValue}/>
                            {
                                this.state.errors.phone ?
                                    <span style={{color: "red"}}>{this.state.errors.phone}</span> : false
                            }
                        </div>
                        <button className="btn btn-primary" type="submit">
                            Thêm mới
                        </button>
                    </form>
                </>
                break;

            case "update":
                jsx = <>
                    <h1>Cập NHật Khách Hàng</h1>
                    <button className="btn btn-primary" type="button" onClick={(e) => {
                        this.handleAction("list")

                    }}>Quay lại
                    </button>
                    <hr/>
                    <form>
                        <div className="mb-3">
                            <label>Tên</label>
                            <input type="text" value={this.state.form.name} name="name" className="form-control"
                                   placeholder="Tên..." onChange={this.changValue}/>
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" value={this.state.form.email} name="email" className="form-control"
                                   placeholder="Email..." onChange={this.changValue}/>
                        </div>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input type="text" value={this.state.form.phone} name="phone" className="form-control"
                                   placeholder="Điện thoại..." onChange={this.changValue}/>
                        </div>
                        <button className="btn btn-primary" type="submit" onClick={this.updateCustomer}>
                            Lưu thay đổi
                        </button>
                    </form>
                </>
                break;

            default:
                jsx = <>
                    <h1>Danh sách Khách hàng</h1>
                    <button className="btn btn-primary" type="button" onClick={() => {
                        this.handleAction("add")
                    }}>Thêm mới
                    </button>
                    <hr/>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th width="5%">STT</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Điện Thoại</th>
                            <th width="5%">Sửa</th>
                            <th width="5%">Xóa</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.customerRender()}

                        </tbody>
                    </table>
                </>
                break;
        }
        return jsx
    }

    handleAction = (action) => {
        this.setState({
            action: action
        })
    }

    handleAddSubmit = (e) => {
        e.preventDefault()
        const errors = {};
        let msg = "";

        const {name, email, phone} = this.state.form

        if (name === "") {
            errors.name = "Vui lòng nhập tên"
        }
        if (email === "") {
            errors.email = "Vui lòng nhập email"
        }
        if (phone === "") {
            errors.phone = "Vui lòng nhập số điện thoại"
        }
        if (Object.keys(errors).length) {
            msg = "Vui lòng kiểm tra các lỗi bên dưới"
        } else {
            fetch(this.customerAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, phone})
            }).then(response => response.json())
                .then(customer => {
                    if (typeof customer === "object") {
                        this.handleAction("list")
                        this.setState({
                            form: {
                                name: "",
                                email: "",
                                phone: ""
                            },
                            customers: this.state.customers.concat(customer)
                        })
                    }
                })
        }
        this.setState({
            errors: errors,
            msg: msg
        })
    }


    changValue = (e) => {
        e.preventDefault()
        const data = {...this.state.form}
        data[e.target.name] = e.target.value

        this.setState({
            form: data
        })

    }

    deleteCustomer = (e) => {
        console.log(e.target.dataset.id)
        fetch(`http://localhost:3004/customers/${e.target.dataset.id}`, {
            method: 'DELETE',
        }).then(() => {
            this.setState({
                customers: this.state.customers.filter((customer) => {
                    return customer.id.toString() !== e.target.dataset.id
                })
            })
        })

    }

    updateCustomer = (e) => {
        e.preventDefault()
        fetch(`http://localhost:3004/customers/${this.state.form.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.state.form),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((customer) => {
                this.setState({
                    customers: this.state.customers.map((item) => {
                        if (customer.id !== item.id) {
                            return item
                        }
                        return customer
                    })
                })
                this.handleAction("list")
            });
    }
    fillForm = (e) => {
        e.preventDefault()
        this.setState({
            form: this.state.customers.find(customer => {
                return customer.id.toString() === e.target.dataset.id
            })
        })
    }

    render() {
        return (
            <>
                <div className="container">
                    {this.renderAction()}
                </div>
            </>
        )
    }

}

export default Customers