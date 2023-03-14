import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from "axios"
import $ from "jquery";
import moment from "moment";

export default class HistoryTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            booking: [],
            user: [],
            customer: [],
            id_booking: "",
            id_user: "",
            id_customer: "",
            id_room_type: "",
            booking_number: "",
            name_customer: "",
            room_type: "",
            email: "",
            booking_date: "",
            check_in_date: "",
            check_out_date: "",
            guest_name: "",
            total_room: "",
            booking_status: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        }
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "admin" ||
                localStorage.getItem("role") === "resepsionis") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem("role")
            } else {
                window.alert("You're not admin or resepsionis!")
                window.location = "/"
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleClose = () => {
        $("#modal_transaction").hide()
    }

    handleEdit = (item) => {
        $("#modal_transaction").show()
        this.setState({
            id_booking: item.id_booking,
            booking_status: item.booking_status,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        let data = {
            booking_status: this.state.booking_status
        }

        if (this.state.action === "update") {
            let url = "http://localhost:8080/booking/update/status/" + this.state.id_booking
            axios.put(url, data, this.headerConfig())
                .then(response => {
                    this.getBooking()
                    this.handleClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:8080/booking/delete/" + id
        if (window.confirm("Are tou sure to delete this type room ? ")) {
            axios.delete(url, this.headerConfig())
                .then(response => {
                    console.log(response.data.message)
                    this.getRoom()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        window.alert("You can't delete this data");
                    }
                })
        }
    }

    handleSearch = () => {
        let data = {
            keyword: this.state.keyword
        }
        let url = "http://localhost:8080/booking/find/filter"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        booking: response.data.data
                    })
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })
                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    getBooking = () => {
        let url = "http://localhost:8080/booking/"
        axios.get(url)
            .then(response => {
                this.setState({
                    booking: response.data.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
            localStorage.clear()
            window.alert("You're not admin or resepsionis!")
            window.location = '/'
        }
    }

    componentDidMount() {
        this.getBooking()
        this.checkRole()
    }


    render() {
        const title = "Transaction History";
        return (
            <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
                <Sidebar />
                <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <Header title={title} />
                    <div class="main-content flex flex-col flex-grow p-4">
                        <div class="mb-4 flex flex-row">
                            <div className="justify-items-center w-1/2">
                                <div className="rounded ml-5">
                                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                                    <div class="relative">
                                        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </div>
                                        <input type="search" id="default-search" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500" placeholder="Please search only by booking number" name='keyword' value={this.state.keyword} onChange={this.handleChange} />
                                        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2" onClick={this.handleSearch}>Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md mx-5">
                            <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">ID</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Customer</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Guest</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Room Type</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Room Total</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Booking Date</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">CheckIn Date</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">CheckOut Date</th>
                                        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Status</th>
                                        {this.state.role === 'resepsionis' && (
                                            <th scope="col" class="px-6 py-4 font-medium text-gray-900">Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100 border-t border-gray-100">
                                    {this.state.booking.map((item, index) => {
                                        return (
                                            <tr class="hover:bg-gray-50" key={index}>
                                                <td class="px-4 py-4">{item.id_booking}</td>
                                                <td class="px-4 py-4">{item.name_customer}</td>
                                                <td class="px-4 py-4">{item.guest_name}</td>
                                                <td class="px-4 py-4">{item.room_type.name_room_type}</td>
                                                <td class="px-4 py-4">{item.total_room}</td>
                                                <td class="px-4 py-4">{moment(item.booking_date).format("DD MMM YYYY")}</td>
                                                <td class="px-4 py-4">{moment(item.check_in_date).format("DD MMM YYYY")}</td>
                                                <td class="px-4 py-4">{moment(item.check_out_date).format("DD MMM YYYY")}</td>
                                                <td class="px-4 py-4">
                                                    <span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                                                        {item.booking_status}
                                                    </span>
                                                </td>
                                                {this.state.role === 'resepsionis' && (
                                                    <td class="px-4 py-4">
                                                        <button className='bg-sky-600 rounded py-2 px-4 text-white font-bold' onClick={() => this.handleEdit(item)}>
                                                            Edit
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <footer class="footer px-4 py-2">
                        <div class="footer-content">
                            <p class="text-sm text-gray-600 text-center">© ukk hotel wikusama</p>
                        </div>
                    </footer>
                </main >

                {/* Modal Form */}
                <div id="modal_transaction" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">Edit Status</h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleSave(event)}>
                                    <div>
                                        <label for="booking_status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Booking Status</label>
                                        <select name="booking_status" onChange={this.handleChange} id="booking_status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800">
                                            <option value={this.state.booking_status}>{this.state.booking_status}</option>
                                            <option value="baru">Baru</option>
                                            <option value="check_in">Check In</option>
                                            <option value="check_out">Check Out</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-sky-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}