import React, {Component} from 'react';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import axios from "axios";

export class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            employees: [],
            firstName: '',
            lastName: '',
            age: '',
            salary: '',
            position: '',
            deleteOpen: false,
            selectedId: '',
            selectedItem: {}
        }
    }

    componentDidMount() {
        axios.get("https://nimadir.herokuapp.com/api/employee")
            .then((res2) => {
                console.log(res2);
                this.setState({
                    employees: res2.data.object
                })
            })
    }

    render() {

        const changeModal = () => {
            this.setState({
                open: !this.state.open
            })
        }

        const changeHandler = (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        const changeDeleteModal = () => {
            this.setState({
                deleteOpen: !this.state.deleteOpen
            })
        }

        const saveEmployee = (event) => {
            event.preventDefault();
            if (this.state.selectedItem.id){
                axios.put("https://nimadir.herokuapp.com/api/employee/" + this.state.selectedItem.id, this.state)
                    .then((res) => {
                        getEmployee();
                        changeModal();
                        this.setState({
                            selectedItem: {}
                        })
                    })
            } else {
                axios.post("https://nimadir.herokuapp.com/api/employee", this.state)
                    .then((res) => {
                        getEmployee();
                        changeModal();
                    })
            }
        }

        const deleteEmployee = (id) =>{
            this.setState({
                selectedId: id,
            });
            changeDeleteModal();
        };

        const deleteEmployeeOriginal = () => {
            axios.delete("https://nimadir.herokuapp.com/api/employee/" + this.state.selectedId)
                .then((res) => {
                    getEmployee();
                    changeDeleteModal();
                })
        };
        const getEmployee =() => {
            axios.get("https://nimadir.herokuapp.com/api/employee")
                .then((res2) => {
                    this.setState({
                        employees: res2.data.object
                    })
                })
        };

        const editEmployee = (item) => {
            this.setState({
                selectedItem: item
            });

            changeModal();
        };
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <button type="button" className="btn btn-success mt-5 ml-auto d-block" onClick={changeModal}>Add</button>
                    </div>
                    {this.state.employees.map((item, index) => {
                        return (
                            <div className="col-4 mt-3" key={item.id}>
                                <div className="card">
                                    <div className="card-header">
                                        <h3>{item.firstName + " " + item.lastName}</h3>
                                    </div>
                                    <div className="card-body">
                                        <p>Age: <b>{item.age}</b></p>
                                        <p>Salary: <b>{item.salary}$</b></p>
                                        <p>Position: <b>{item.position}</b></p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between align-items-center">
                                        <button type="button" className="btn btn-success" onClick={() => editEmployee(item)}>Edit</button>
                                        <button type="button" className="btn btn-danger" onClick={() => deleteEmployee(item.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Modal isOpen={this.state.open} toggle={changeModal}>
                    <ModalHeader>
                        Add Employee
                    </ModalHeader>
                    <form onSubmit={saveEmployee} method="post">
                        <ModalBody>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Firstname"
                                name="firstName"
                                onChange={changeHandler}
                            />

                            <input
                                type="text"
                                className="form-control mt-3"
                                placeholder="Lastname"
                                name="lastName"
                                onChange={changeHandler}
                            />

                            <input
                                type="number"
                                className="form-control mt-3"
                                placeholder="Age"
                                name="age"
                                onChange={changeHandler}
                            />

                            <input
                                type="number"
                                className="form-control mt-3"
                                placeholder="Salary"
                                name="salary"
                                onChange={changeHandler}
                            />

                            <select
                                name="position"
                                className="form-control mt-3"
                                onChange={changeHandler}
                            >
                                <option value="CEO">CEO</option>
                                <option value="Manager">Manager</option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Security">Security</option>
                                <option value="Driver">Driver</option>
                            </select>
                        </ModalBody>
                        <ModalFooter>
                            <button type="submit" className="btn btn-success">Save</button>
                            <button type="button" className="btn btn-secondary" onClick={changeModal}>Cancel</button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.deleteOpen} toggle={changeDeleteModal}>
                    <ModalBody>
                        <h4>Rostdan ham o'chirmoqchimisiz?</h4>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-danger" onClick={deleteEmployeeOriginal}>Ha</button>
                        <button type="button" className="btn btn-secondary" onClick={changeDeleteModal}>Yo'q</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}