const submitButton = document.querySelector("form article button");
const constant = {
  apiKey: "AIzaSyB1zXz8EoouaXV56pjiu87dhEO7G8e1SMU",
  authDomain: "iphr-2024-part2.firebaseapp.com",
  projectId: "iphr-2024-part2",
  storageBucket: "iphr-2024-part2.appspot.com",
  messagingSenderId: "333899274413",
  appId: "1:333899274413:web:09cda94ff22c379c7e4e24",
  measurementId: "G-1B4GPPGF1N"
};
const thisisanapplicationbitch = firebase.initializeApp(constant);
const pleasedonthack = firebase.firestore();

function limitWords(str, maxChars) {
  // remove whitespace at the beginning and end of the string
  str = str.trim();

  // truncate to the maximum character length
  if (str.length > maxChars) {
    return str.substr(0, maxChars) + "...";
  }

  // count the number of words
  return str;
}

// async function view() {

//   sessionStorage.setItem("viewed", true);
// }

// onload = () => {
//   if (!sessionStorage.getItem("viewed")) view();
// };

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".loader").style.display = "grid";
  const fields = [
    ...document.querySelectorAll(
      "form article input[type=text]:not(#custom-select-input)"
    ),
  ].map(function (field) {
    return {
      name: field.getAttribute("name"),
      value: field.value != "on" ? field.value : field.checked,
    };
  });
  let hear_about = [...document.querySelectorAll("form input[name=HEARABOUT]")]
    .filter(function (field) {
      return field.checked === true;
    })
    .map((option) => option.id);
  for (const field of fields) {
    if (
      field.name !== "Middle Name" &&
      field.name !== "Ambassador Code" &&
      field.name !== "Where Did You Hear About The Competition from"
    ) {
      if (!field.value) {
        document.querySelector(".loader").style.display = "none";
        giveAlert(
          "Please Enter a Valid " + field.name,
          "#003597",
          "International Physics Realm"
        );
        return;
      }
    }

    if (field.name === "First Name" || field.name === "Last Name") {
      if (!isNaN(field.value)) {
        document.querySelector(".loader").style.display = "none";
        giveAlert(
          "Please Enter a Valid " + field.name,
          "#003597",
          "International Physics Realm"
        );
        return;
      } else {
        if (/^[A-Za-z\s]+$/i.test(field.value)) {
          continue;
        } else {
          giveAlert(
            "Please Enter a Valid " + field.name,
            "#003597",
            "International Physics Realm"
          );
          return;
        }
      }
    }
    if (field.name === "Email") {
      if (
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
          field.value
        )
      ) {
        continue;
      } else {
        document.querySelector(".loader").style.display = "none";
        giveAlert(
          "Please Enter a Valid " + field.name,
          "#003597",
          "International Physics Realm"
        );
        return;
      }
    }

    function validateDate(dateString) {
      const datePattern =
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
      if (!datePattern.test(dateString)) {
        return false;
      }

      // Further validation for days in each month
      const parts = dateString.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Check for months with 30 days
      if (
        (month === 4 || month === 6 || month === 9 || month === 11) &&
        day > 30
      ) {
        return false;
      }

      // Check for February
      if (month === 2) {
        const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        if (day > 29 || (day === 29 && !isLeap)) {
          return false;
        }
      }

      return true;
    }

    if (field.name === "Birthday") {
      if (validateDate(field.value)) {
        continue;
      } else {
        document.querySelector(".loader").style.display = "none";

        giveAlert(
          "Please Enter a Valid " + field.name,
          "#003597",
          "International Physics Realm"
        );
        return;
      }
    }

    if (field.name === "Ambassador Code") {
      if (hear_about.includes("AM")) {
        console.log(field.value);
        if (/^IPhR-(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})$/i.test(field.value)) {
          continue;
        } else {
          document.querySelector(".loader").style.display = "none";
          giveAlert(
            "Please Enter a Valid " + field.name,
            "#003597",
            "International Physics Realm"
          );
          return;
        }
      } else {
        continue;
      }
    }
    if (field.name === "Where Did You Hear About The Competition from") {
      if (hear_about.includes("OT")) {
        if (field.value) {
          continue;
        } else {
          document.querySelector(".loader").style.display = "none";
          giveAlert(
            "Please Specify other source",
            "#003597",
            "International Physics Realm"
          );
          return;
        }
      } else {
        continue;
      }
    }
  }
  let grade = [...document.querySelectorAll("form input[name=gender]")].filter(
    function (field) {
      return field.checked === true;
    }
  );
  if (grade.length == 0) {
    document.querySelector(".loader").style.display = "none";

    giveAlert("Please Chose a Grade", "#003597", "International Physics Realm");
    return;
  } else {
    grade = grade[0].id;
  }

  if (hear_about.length == 0) {
    document.querySelector(".loader").style.display = "none";

    giveAlert(
      "Please Chose Where Did You Hear About IPhR",
      "#003597",
      "International Physics Realm"
    );
    return;
  }

  const rules = document.querySelector("form input[name=rules]");
  if (!rules.checked) {
    document.querySelector(".loader").style.display = "none";

    giveAlert("Please confirm that you've read IPhR's rules", "#003597");
    return;
  }

  const updates = document.querySelector("form input[name=updates]");
  if (!updates.checked) {
    document.querySelector(".loader").style.display = "none";

    giveAlert(
      "Please confirm to have IPhR's updates",
      "#003597",
      "International Physics Realm"
    );
    return;
  }
  const newsletter = document.querySelector("form input[name=newsletter]");

  const chosenCountry = document.getElementById("custom-select-input").value;
  if (!chosenCountry) {
    document.querySelector(".loader").style.display = "none";
    giveAlert(
      "Please Choose Your Country",
      "#003597",
      "International Physics Realm"
    );
    return;
  }

  const mainDataObject = {};
  fields
    .map((field) => {
      return { [field.name]: field.value };
    })
    .map((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      mainDataObject[key] = value;
    });
  const participant = {
    ...mainDataObject,
    grade: grade,
    country: chosenCountry,
    hear_about: hear_about,
    updates: updates.checked,
    newsletter: newsletter.checked,
  };
  async function addDocument() {
    try {
      if (
        /^IPhR-(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})$/i.test(
          participant["Ambassador Code"]
        )
      ) {
        let AmbassadorEmail;
        await pleasedonthack
          .collection("Ambassadors")
          .where("code", "==",  participant["Ambassador Code"])
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id);
              AmbassadorEmail = doc.id;
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
        if (["G9", "G10"].includes(participant.grade)) {
          console.log(AmbassadorEmail);
          pleasedonthack
            .collection("Ambassadors")
            .doc(AmbassadorEmail)
            .update({ regular: firebase.firestore.FieldValue.increment(1) });
        }
        if (["G12", "G11"].includes(participant.grade)) {
          pleasedonthack
            .collection("Ambassadors")
            .doc(AmbassadorEmail)
            .update({ advanced: firebase.firestore.FieldValue.increment(1) });
        }
      }
      await pleasedonthack.collection("Registrations").add({
        ...participant,
        registeredTime: new Date(Date.now()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }),
      });
      (async function () {
        document.querySelector(".loader").style.display = "none";
        await giveAlert(
          "Registration Completed Successfully ",
          "#04AA6D",
          "International Physics Realm"
        );
        location.href = "https://octphysicsclub.org/competition/"
      })();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  addDocument();
});

function giveAlert(alert, color, from, clicky, yesNo) {
  return new Promise((resolve, reject) => {
    let body = document.createElement("div"),
      text = document.createElement("p"),
      response = document.createElement("button"),
      admin = document.createElement("p"),
      overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;cursor:pointer;z-index:99998;width:100vw;height:100vh;background-color:#00000090;top:0;left:0;";
    text.textContent = alert;
    response.innerText = "OK";
    admin.textContent = from || "Admins" + " Says";
    response.style.cssText = `width:100px;background-color:${
      color || "#0050b2"
    };padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
    body.style.cssText =
      "display:flex;z-index:999999;padding:30px;align-items:start;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:90%;background-color:#fff;border-radius:5px;flex-direction:column;justify-content:space-evenly;";
    if (!clicky) {
      overlay.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        if (yesNo) {
          reject();
        }
        resolve();
      });
      response.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        resolve();
      });
    }

    body.append(admin, text);
    if (yesNo) {
      const no = document.createElement("button");
      no.innerText = "No, Don't delete";
      no.style.cssText = `width:120px;background-color:#2ecc71;padding:5px 10px;cursor:pointer;border:0;align-self:end;border-radius:10px;color:#fff;`;
      no.addEventListener("click", function () {
        body.remove();
        overlay.remove();
        reject();
      });
      const res = document.createElement("div");
      response.textContent = "Yes delete";
      res.append(no, response);
      res.style.cssText =
        "display:flex;justify-content:flex-end;gap:10px;width:100%;";
      body.append(res);
    } else {
      body.append(response);
    }
    document.body.append(body, overlay);
  });
}
const csSelector = document.querySelector("#myCustomSelect");
const csInput = csSelector.querySelector("input");
const csList = csSelector.querySelector("ul");
const cslis = csList.querySelectorAll("li");
const csIcons = csSelector.querySelectorAll("svg");
const csStatus = document.querySelector("#custom-select-status");
const alis = Array.from(cslis);

let csState = "initial";
csSelector.setAttribute("role", "combobox");
csSelector.setAttribute("aria-haspopup", "listbox");
csSelector.setAttribute("aria-owns", "custom-select-list");
csInput.setAttribute("aria-autocomplete", "both");
csInput.setAttribute("aria-controls", "custom-select-list");
csList.setAttribute("role", "listbox");
cslis.forEach(function (li) {
  li.setAttribute("role", "li");
  li.setAttribute("tabindex", "-1");
});
csStatus.textContent =
  cslis.length +
  " lis available. Arrow down to browse or start typing to filter.";
csSelector.addEventListener("click", function (e) {
  const currentFocus = findFocus();
  switch (csState) {
    case "initial":
      toggleList("Open");
      setState("opened");
      break;
    case "opened":
      if (currentFocus === csInput) {
        toggleList("Shut");
        setState("initial");
      } else if (currentFocus.tagName === "LI") {
        makeChoice(currentFocus);
        toggleList("Shut");
        setState("closed");
      }
      break;
    case "filtered":
      if (currentFocus.tagName === "LI") {
        makeChoice(currentFocus);
        toggleList("Shut");
        setState("closed");
      }
      break;
    case "closed":
      toggleList("Open");
      setState("filtered");
      break;
  }
});

csSelector.addEventListener("keyup", function (e) {
  doKeyAction(e.key);
});

document.addEventListener("click", function (e) {
  if (!e.target.closest("#myCustomSelect")) {
    toggleList("Shut");
    setState("initial");
  }
});
function toggleList(whichWay) {
  if (whichWay === "Open") {
    csList.classList.remove("hidden-all");
    csSelector.setAttribute("aria-expanded", "true");
  } else {
    csList.classList.add("hidden-all");
    csSelector.setAttribute("aria-expanded", "false");
  }
}

function findFocus() {
  const focusPoint = document.activeElement;
  return focusPoint;
}

function moveFocus(fromHere, toThere) {
  const aCurrentlis = alis.filter(function (li) {
    if (li.style.display === "") {
      return true;
    }
  });
  if (aCurrentlis.length === 0) {
    return;
  }
  if (toThere === "input") {
    csInput.focus();
  }
  switch (fromHere) {
    case csInput:
      if (toThere === "forward") {
        aCurrentlis[0].focus();
      } else if (toThere === "back") {
        aCurrentlis[aCurrentlis.length - 1].focus();
      }
      break;
    case cslis[0]:
      if (toThere === "forward") {
        aCurrentlis[1].focus();
      } else if (toThere === "back") {
        csInput.focus();
      }
      break;
    case cslis[cslis.length - 1]:
      if (toThere === "forward") {
        aCurrentlis[0].focus();
      } else if (toThere === "back") {
        aCurrentlis[aCurrentlis.length - 2].focus();
      }
      break;
    default:
      const currentItem = findFocus();
      const whichOne = aCurrentlis.indexOf(currentItem);
      if (toThere === "forward") {
        const nextOne = aCurrentlis[whichOne + 1];
        nextOne.focus();
      } else if (toThere === "back" && whichOne > 0) {
        const previousOne = aCurrentlis[whichOne - 1];
        previousOne.focus();
      } else {
        csInput.focus();
      }
      break;
  }
}

function doFilter() {
  const terms = csInput.value;
  const aFilteredlis = alis.filter(function (li) {
    if (li.innerText.toUpperCase().startsWith(terms.toUpperCase())) {
      return true;
    }
  });
  cslis.forEach((li) => (li.style.display = "none"));
  aFilteredlis.forEach(function (li) {
    li.style.display = "";
  });
  setState("filtered");
  updateStatus(aFilteredlis.length);
}

function updateStatus(howMany) {
  csStatus.textContent = howMany + " lis available.";
}

function makeChoice(whichli) {
  const liTitle = whichli.querySelector("strong");
  csInput.value = liTitle.textContent;
  moveFocus(document.activeElement, "input");
}

function setState(newState) {
  switch (newState) {
    case "initial":
      csState = "initial";
      break;
    case "opened":
      csState = "opened";
      break;
    case "filtered":
      csState = "filtered";
      break;
    case "closed":
      csState = "closed";
  }
}

function doKeyAction(whichKey) {
  const currentFocus = findFocus();
  switch (whichKey) {
    case "Enter":
      if (csState === "initial") {
        toggleList("Open");
        setState("opened");
      } else if (csState === "opened" && currentFocus.tagName === "LI") {
        makeChoice(currentFocus);
        toggleList("Shut");
        setState("closed");
      } else if (csState === "opened" && currentFocus === csInput) {
        toggleList("Shut");
        setState("closed");
      } else if (csState === "filtered" && currentFocus.tagName === "LI") {
        makeChoice(currentFocus);
        toggleList("Shut");
        setState("closed");
      } else if (csState === "filtered" && currentFocus === csInput) {
        toggleList("Open");
        setState("opened");
      } else {
        toggleList("Open");
        setState("filtered");
      }
      break;

    case "Escape":
      if (csState === "opened" || csState === "filtered") {
        toggleList("Shut");
        setState("initial");
      }
      break;

    case "ArrowDown":
      if (csState === "initial" || csState === "closed") {
        toggleList("Open");
        moveFocus(csInput, "forward");
        setState("opened");
      } else {
        toggleList("Open");
        moveFocus(currentFocus, "forward");
      }
      break;
    case "ArrowUp":
      if (csState === "initial" || csState === "closed") {
        toggleList("Open");
        moveFocus(csInput, "back");
        setState("opened");
      } else {
        moveFocus(currentFocus, "back");
      }
      break;
    default:
      if (csState === "initial") {
        toggleList("Open");
        doFilter();
        setState("filtered");
      } else if (csState === "opened") {
        doFilter();
        setState("filtered");
      } else if (csState === "closed") {
        doFilter();
        setState("filtered");
      } else {
        doFilter();
      }
      break;
  }
}
