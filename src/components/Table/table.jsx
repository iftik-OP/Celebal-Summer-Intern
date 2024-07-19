import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import "./table.scss";
import jsPDF from "jspdf";
import { auth, db } from "../../firebaseConfig"; // Adjust the path if needed
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

const Table = () => {
  const [table, setTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (user) {
        const ordersRef = collection(db, "deliveries");
        const ordersQuery = query(
          ordersRef,
          where("senderEmail", "==", user.email)
        );
        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTable(orders);
        });

        return () => unsubscribe(); // Cleanup the onSnapshot listener on unmount
      }
    };

    fetchData();
  }, []);

  const deleteOrder = async (id) => {
    let c = window.confirm("Are you sure you want to cancel the order?");
    if (c) {
      try {
        await updateDoc(doc(db, "deliveries", id), { cancelled: true });
        setTable((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, cancelled: true } : order
          )
        );
        alert("Order Cancelled");
      } catch (err) {
        console.log(err);
        alert("Order Cancellation Unsuccessful");
      }
    }
  };

  const generateInvoice = (row) => {
    const doc = new jsPDF();

    const content = `
      Pickup Date & Time: ${row.dateTime}
      Receiver Name: ${row.receiverName}
      Pickup Address: ${row.pickupLocation}
      Drop Address: ${row.dropLocation}
      Package Weight: ${row.packageWeight}
      Payment Mode: ${row.paymentMode}
      Total Price: Rs ${row.totalPrice}
    `;
    doc.setFontSize(14);
    doc.text(content, 10, 10);

    doc.save("invoice.pdf");
  };

  return (
    <>
      <div className="md:container md:mx-auto grid grid-cols-5  gap-x-2 h-screen">
        <Sidebar />
        <div className="card col-span-4">
          <section className="dash">
            <h4>Deliveries</h4>
            <section className="tableSection">
              <table>
                <thead>
                  <tr>
                    <th>Pickup Date & Time</th>
                    <th>Package Weight</th>
                    <th>Pickup Address</th>
                    <th>Receiver Name</th>
                    <th>Drop Address</th>
                    <th>Payment Mode</th>
                    <th>Total Bill</th>
                    <th>Status</th>
                    <th>Cancel Order</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {table.length > 0 ? (
                    table.map((row, i) => (
                      <tr key={i}>
                        <td>{row.dateTime}</td>
                        <td style={{ paddingLeft: "25px" }}>
                          {row.packageWeight}
                        </td>
                        <td>{row.pickupLocation}</td>
                        <td>{row.receiverName}</td>
                        <td>{row.dropLocation}</td>
                        <td style={{ paddingLeft: "40px" }}>
                          {row.paymentMode}
                        </td>
                        <td>{row.totalPrice}</td>
                        <td>{row.cancelled ? "Cancelled" : "Active"}</td>
                        <td style={{ paddingLeft: "40px" }}>
                          {!row.cancelled && (
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/9426/9426995.png"
                              alt="cancel delivery"
                              width="20"
                              height="20"
                              onClick={() => deleteOrder(row.id)}
                            />
                          )}
                        </td>
                        <td style={{ paddingLeft: "20px" }}>
                          <img
                            className="download"
                            src="https://cdn-icons-png.flaticon.com/512/4208/4208382.png"
                            alt="download invoice"
                            width="25"
                            height="25"
                            onClick={() => generateInvoice(row)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10}>Order History Empty...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </section>
        </div>
      </div>
    </>
  );
};

export default Table;
