const { response } = require("express");
const { ServerResponse } = require("http");

// create variable to hold db connection
let db;
// establish a connection to IndexedDB database
const request = indexedDB.open('budget=tracker', 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("bank_transaction", { autoIncremente: true});
};


request.onsuccess = function(event) {

    db = event.target.result;
  
    if (navigator.onLine) {
      uploadBankTransaction();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

 // This function will be executed if we attempt to submit a new pizza and there's no internet connection
 function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['bank_transaction'], 'readwrite');

    const bankObjectStore = transation(["bank_transaction"], "readwrite");

    bankObjectStore.add(record);
 }

    function uploadBankTransaction() {
      const transaction = db.transaction(["bank_transaction"], "readwrite");
    
  
    // access the object store
    const bankObjectStore = transaction.objectStore('bank_transaction');

    const getAll = bankObjectStore.getAll();

    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("api/transaction/bulk", {
          method: "POST", 
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(ServerResponse => {
          if (ServerResponse.message) {
            throw new Error(ServerResponse);
          }


          const transaction = db.transaction(["bank_transaction"], "readwrite");

          const bankObjectStore = transaction.objectStore("bank_transaction");

          bankObjectStore.clear();

          alert("Saved transactions have been submitted");
        })

        .catch(err => {
          console.log(err);
        });        
      }
    };
    };

    window.addEventListener('online', uploadBankTransaction);
  
    // // add record to your store with add method
    // pizzaObjectStore.add(record);