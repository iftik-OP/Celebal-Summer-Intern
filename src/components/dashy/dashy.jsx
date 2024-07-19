import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Chart from "react-apexcharts";
import { auth, db } from "../../firebaseConfig"; // Adjust the path if needed
import { collection, query, onSnapshot, where } from "firebase/firestore";
import "./dashy.css";

const Dashy = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching the current user
        const user = auth.currentUser;

        if (user) {
          setName(user.displayName || "User");

          // Fetching orders with sender's email equal to the current user's email
          const ordersRef = collection(db, "deliveries");
          const ordersQuery = query(
            ordersRef,
            where("senderEmail", "==", user.email)
          );
          const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const orders = snapshot.docs.map((doc) => doc.data());

            // Calculate total orders
            setTotalOrders(orders.length);

            // Calculate total spent
            const totalSpent = orders.reduce(
              (acc, order) => acc + (order.totalPrice || 0),
              0
            );
            setTotalSpent(totalSpent);

            // Calculate monthly orders
            const monthCount = new Array(12).fill(0);
            orders.forEach((order) => {
              if (order.date) {
                const [datePart, timePart] = order.date.split(" ");
                const [year, month, day] = datePart.split("-").map(Number);
                const [hours, minutes] = timePart.split(":").map(Number);
                const orderDate = new Date(
                  year,
                  month - 1,
                  day,
                  hours,
                  minutes
                );
                const monthIndex = orderDate.getMonth(); // getMonth() returns month from 0-11
                monthCount[monthIndex]++;
              }
            });
            setMonthlyOrders(monthCount);
          });

          return () => unsubscribe(); // Cleanup the onSnapshot listener on unmount
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: "Monthly Orders",
      data: monthlyOrders,
    },
  ];

  const options = {
    chart: {
      height: 250,
      type: "bar",
    },
    plotOptions: {
      bar: {
        columnWidth: "25%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          fontSize: "16px",
        },
      },
    },
  };

  return (
    <div className="md:container md:mx-auto grid grid-cols-5 gap-x-2 h-screen">
      <Sidebar />
      <div className="col-span-4 pe-9 pt-10">
        <div className="font-semibold text-xl">Welcome, {name}</div>
        <div className="grid grid-cols-3 gap-6 mt-12 h-44 drop-shadow-lg">
          <div className="bg-gradient-to-r from-cyan-500 to-slate-100 rounded-lg">
            <p className="text-2xl font-medium ps-6 mt-5">Total Orders</p>
            <div className="container mt-3 ps-12">
              <div className="flex flex-row space-x-36">
                <p className="font-light text-7xl">{totalOrders}</p>
                <img
                  className=""
                  src="https://cdn-icons-png.flaticon.com/512/9486/9486069.png"
                  alt=""
                  width="90"
                  height="100"
                />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-bl from-lime-100 to-emerald-600 rounded-lg">
            <p className="text-2xl font-medium ps-6 mt-5">Total Spent</p>
            <p className="font-bold text-6xl text-left p-4">
              &#8377;{totalSpent}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-12 h-80 drop-shadow-lg">
          <div className="bg-gradient-to-tl from-cyan-600 to-sky-100 col-span-2 rounded-lg">
            <p className="text-2xl font-medium ps-6 mt-5">Monthly Orders</p>
            <Chart
              options={options}
              series={series}
              type="bar"
              height={260}
              width={770}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashy;
