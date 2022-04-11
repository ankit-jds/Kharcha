// importing style.css for tailwindCSS bundling with webpack.
import "./style.css";
// import "https://cdn.datatables.net/1.11.3/css/jquery.dataTables.css";
// import "https://cdn.datatables.net/1.11.3/js/jquery.dataTables.js";
// import "https://code.jquery.com/jquery-3.6.0.slim.min.js";


console.log("Style is imported...");

// import { google } from "googleapis";

//
// // Import the functions you need from the SDKs you need
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNxuwJvMmc920cM56AZimYwgN7py343PY",
  authDomain: "kharcha-6f1ce.firebaseapp.com",
  projectId: "kharcha-6f1ce",
  storageBucket: "kharcha-6f1ce.appspot.com",
  messagingSenderId: "1017249439013",
  appId: "1:1017249439013:web:f52b4ea73b7aa2ab510ecc",
  measurementId: "G-QJRC9NJ27G",
  databaseURL:
    "https://kharcha-6f1ce-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const database = getDatabase(app);

async function writeData(path, data) {
  await set(ref(database, path), data);
  console.log("Data is written", path, data);
  return "Data is written...";
}

function toggle_the_hide(element_id, hide = true) {
  console.log(hide, element_id);
  let element = document.getElementById(`${element_id}`);
  console.log(element);
  if (element && hide) {
    element.classList.add("hidden");
    // console.log("hidden");
  } else if (element) {
    element.classList.remove("hidden");
    // console.log("shown");
  } else {
    console.log("No such element exists.");
  }
}

onAuthStateChanged(auth, (user) => {
  // console.log(user.metadata);

  console.log("auth state is changed.");
  if (user) {
    console.log("user is logged in...");

    // hide the login section
    toggle_the_hide("login_page");

    // show the main section
    toggle_the_hide("main_page", false);
  } else {
    // hide the main section
    toggle_the_hide("main_page");

    // show the login section
    toggle_the_hide("login_page", false);

    console.log("no user is logged in..");
  }
});

function showPassword() {
  // console.log("func started");
  var x = [document.getElementById("password")];
  for (let index = 0; index < x.length; index++) {
    const password = x[index];
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }
}

function loginUser(e) {
  console.log(getdatetime(), "LOGIN....");
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("userUID", user.uid);
      console.log(user.uid, getdatetime());

      toggle_the_hide("login_page");
      toggle_the_hide("main_page", false);
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
}
// Starts from here...
console.log("This is the console log from index.js ");

// A function to get the getdatetime() datetime or a specific date in dd/mm/yyyy format.
function getdatetime(date = "now") {
  let datetime;
  if (date === "now") {
    datetime = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Calcutta",
      hour12: false,
    });
    // console.log(datetime, "new date");
  } else {
    datetime = new Date(date).toLocaleString("en-GB", {
      timeZone: "Asia/Calcutta",
      hour12: false,
    });
    // console.log(datetime, "new date");
  }
  datetime = datetime.split(",");
  console.log(datetime);
  return {
    date: datetime[0],
    time: datetime[1].trim(),
  };
}

window.onload = () => {
  console.log("window is loaded...");

  let show_password = document.getElementById("showPassword");
  if (show_password) {
    console.log("eveent");
    show_password.addEventListener("click", () => {
      console.log("eveent");
      showPassword();
    });
  }

  let login_form = document.getElementById("login");
  if (login_form) {
    login_form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Login form is submitted....");
      loginUser(e);
    })
  }

  let logout_btn = document.getElementById("logout");
  if (logout_btn) {
    logout_btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Logout btn is clicked...");
      signOut(auth);
    })
  }

};

// Kharcha form object
// this is the object that will be saved to the firebase realtime database.

var kharcha_form_obj = {
  date: getdatetime("now").date,
  category: null,
  category_details: {},
  payment_method: null,
  paid_by: "myself",
  amount: null,
};

// console.log(kharcha_form_obj);

// The main form of Kharcha app which is used to save transaction is here in 'kharcha_form'.
let kharcha_form = document.getElementById("kharcha_form");
if (kharcha_form) {
  // console.log(kharcha_form);

  // adding event Listener on that form so whenever user changes the inputs, an event will be fired, which we can get accessed using 'target'
  kharcha_form.addEventListener("change", (e) => {
    e.preventDefault();

    // with help of target we can get the input element which is changed.
    let target = e.target;
    console.log(target);

    // The new value that is added by user.
    let value = target.value;
    // console.log(value);

    let target_name = target.name;

    if (target_name === "old_records") {
      let code = ``;
      if (target.checked) {
        code = `<div class="pl-6 p-2">
        <label
          for="old_record_date"
          class="
            bg-orange-400
            text-black
            font-medium
            px-2
            rounded-lg
            flex flex-col
            pb-2
          "
        >
          Old Record Date
          <input
            class=""
            type="date"
            name="old_record_date"
            id="old_record_date"
            value="old_record_date"
            required
          />
        </label>
      </div>`;
      } else {
        kharcha_form_obj.date = getdatetime().date;
      }
      document.getElementById("old_record_date_wrap").innerHTML = code;
      console.log("Old Record is changed.");
    } else if (target_name === "old_record_date") {
      console.log("date is set...");
      console.log(target.value);
      kharcha_form_obj.date = getdatetime(target.value).date;
    } else if (target_name === "categories") {
      if (target.checked) {
        let code = `<div class="pl-6 p-2">`;
        switch (target.id) {
          case "travel":
            console.log("travel");

            // Change category to 'travel' into Form_object.
            kharcha_form_obj.category = "travel";
            kharcha_form_obj.category_details = {};

            code += `<h2 class="font-medium ">Travel Mode</h2>
            `;
            let travel_options = ["auto", "van", "bus", "ola", "uber"];

            travel_options.forEach((element) => {
              let template_code = `<label
              for="${element}"
              class="
                bg-slate-600
                text-white
                px-2
                rounded-lg
                inline-flex
                items-center
              "
            >
              <input
                class="text-l h-4 w-4 mr-1"
                type="radio"
                name="${target.id}_mode"
                id="${element}"
                value="${element}"
                required
              />
              ${element}
            </label>`;

              code += template_code;
            });

            code += `
            <label for="from_place" class="block px-2">
          <p class="">From</p>
          <input
            class="text-l outline outline-1 outline-black"
            type="text"
            name="from_place"
            id="from_place"
            required
          />
        </label>

            <label for="to_place" class="block px-2">
          <p class="">To</p>
          <input
            class="text-l outline outline-1 outline-black"
            type="text"
            name="to_place"
            id="to_place"
            required
          />
        </label>
            `;
            break;
          case "food":
            console.log("food");

            // Change category to 'food' into Form_object.
            kharcha_form_obj.category = "food";
            kharcha_form_obj.category_details = {};

            let element = "what_you_ate";
            let what_you_ate_code = `<label for="what_you_ate" class="block px-2">
            <p class="">What you ate</p>
            <input
              class="text-l outline outline-1 outline-black"
              type="text"
              name="what_you_ate"
              id="what_you_ate"
              required
            />
          </label>`;
            let reviews_code = `<label for="reviews" class="block px-2">
          <p class="">Reviews</p>
          <input
            class="text-l outline outline-1 outline-black"
            type="text"
            name="reviews"
            id="reviews"
            required
          />
        </label>`;

            code += what_you_ate_code + reviews_code;
            break;
          case "shopping":
            console.log("shopping");

            // Change category to 'shopping' into Form_object.
            kharcha_form_obj.category = "shopping";
            kharcha_form_obj.category_details = {};

            let shopname_code = `<label for="shopname" class="block px-2">
            <p class="">Shop Name</p>
            <input
              class="text-l outline outline-1 outline-black"
              type="text"
              name="shopname"
              id="shopname"
              required
            />
          </label>`;
            let itemslist_code = `
          <h2 class="font-medium ">Items List</h2>
          <p>0 Items</p>
          <h2 class="font-medium ">Add Items</h2>

          `;
            let itemname_code = `<label for="itemname" class="block px-2">
            <p class="">Item Name</p>
            <input
              class="text-l outline outline-1 outline-black"
              type="text"
              name="itemname"
              id="itemname"
              required
            />
          </label>`;

            let itemprice_code = `<label for="price" class="block px-2">
          <p class="">Price</p>
          <input
            class="text-l outline outline-1 outline-black"
            type="number"
            name="price"
            id="price"
            required
          />
        </label>`;

            let additem_btn = `
        <div class="pl-6 p-2">
          <input
              class="w-full bg-green-400 rounded-md"
              type="button"
              id="additem"
              name="additem"
              value="Add Item"
            />
        </div>
        `;
            let item_template_code = itemname_code + itemprice_code;

            code +=
              shopname_code + itemslist_code + item_template_code + additem_btn;
            break;

          default:
            break;
        }
        document.getElementById("category_details").innerHTML = code + "</div>";
      }
    } else if (target_name === "payment_method") {
      if (target.checked) {
        // console.log("Payment method is selected...");

        // Set payment_method to target.id in form_object.
        kharcha_form_obj.payment_method = target.id;

        if (target.id === "friend") {
          // Change

          console.log("friend is selected");
          let paid_by_element = document.getElementById("paid_by");
          paid_by_element.getElementsByTagName("SELECT")[0].disabled = false;
        } else {
          let paid_by_element = document.getElementById("paid_by");
          paid_by_element.getElementsByTagName("SELECT")[0].disabled = true;
          paid_by_element.getElementsByTagName("SELECT")[0].value = "myself";
          kharcha_form_obj.paid_by = "myself";
        }
      }
    } else {
      console.log("else is running...", target_name, target.id, target.value);
      if ((target_name !== "itemname") & (target_name !== "price")) {
        if (target.closest("#category_details")) {
          kharcha_form_obj.category_details[target_name] = target.value;
        } else {
          console.log("only this will be added to obj....");
          kharcha_form_obj[target_name] = target.value;
        }
      }
    }
    console.log(kharcha_form_obj);
  });
  // console.log(kharcha_form_obj);

  // adding event listener on the form for submit action.
  kharcha_form.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Validating the data....");

    // writing data to the database.
    let now_time = getdatetime();
    let path = `all_transactions/transaction@${now_time.date
      .split("/")
      .join("-")}_${now_time.time}`;
    writeData(path, kharcha_form_obj);

    fetch('https://api.sheetmonkey.io/form/nVyZQoDeB7S83T84xTNJju', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kharcha_form_obj),
    }).then((result) => {
      // Handle the result
      console.log(result);
    });
    // kharcha_form.reset();
    location.href = "/";
    alert("Your transaction is recorded...")

  });
}

$.fn.dataTable.render.moment = function (from, to, locale) {
  // Argument shifting
  if (arguments.length === 1) {
    locale = 'en';
    to = 'DD/MM/YYYY';
    from = 'DD/MM/YYYY';
  }
  else if (arguments.length === 2) {
    locale = 'en';
  }

  return function (d, type, row) {
    if (!d) {
      return type === 'sort' || type === 'type' ? 0 : d;
    }

    var m = window.moment(d, from, locale, true);

    // Order and type get a number value from Moment, everything else
    // sees the rendered value
    return m.format(type === 'sort' || type === 'type' ? 'x' : to);
  };
};



const all_transactions_ref = ref(database, 'all_transactions');
onValue(all_transactions_ref, (snapshot) => {
  const data = snapshot.val();
  console.log(data);

  let data_keys = Object.keys(data);
  let structured_data = [];
  data_keys.forEach((key) => {
    console.log(key);
    let transactionId = key;
    let transaction = data[key];

    let { amount, category, category_details, date, paid_by, payment_method } = transaction;
    structured_data.push([date, category, category_details, payment_method, paid_by, amount]);

    console.log(structured_data);
  });

  let view_table = document.getElementById("view_table");
  if (view_table) {
    $(document).ready(function () {
      console.log("view start jquery*");
      $('#view_table').DataTable({
        data: structured_data,
        "bDestroy": true,
        columns: [
          {
            title: "Date",
            render: $.fn.dataTable.render.moment('M/D/YYYY')
          },
          {
            title: "Category",
            render: function (structured_data, type) {
              return `<p class="">${structured_data}</p>`;
            }
          },
          {
            title: "Category Details",
            render: function (structured_data, type) {
              return `<p class="">${JSON.stringify(structured_data)}</p>`;
            }
          },
          {
            title: "Payment Method",
            render: function (structured_data, type) {
              return `<p class="">${structured_data}</p>`;
            }
          },
          {
            title: "Paid by",
            render: function (structured_data, type) {
              return `<p class="" > ${structured_data}</p> `;
            }
          },
          {
            title: "Amount",
            render: function (structured_data, type) {
              return `<p class="" > ${structured_data}</p> `;
            }
          }
        ]
      })
    })
  }
  // updateStarCount(postElement, data);
});


