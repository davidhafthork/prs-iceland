export const registrationContent = {
  modalTitle: "Skráning í",
  fields: {
    name: {
      label: "Nafn",
      placeholder: "Fullt nafn",
      icon: "User"
    },
    email: {
      label: "Netfang",
      placeholder: "netfang@example.com",
      icon: "Mail"
    },
    phonenumber: {
      label: "Sími",
      placeholder: "1234567",
      icon: "Mobile"
    },
    division: {
      label: "Flokkur",
      placeholder: "Veldu flokk",
      icon: "Target",
      options: ['Open', 'Production', 'Tactical']
    },
    city: {
      label: "Bær/Sveitarfélag (valfrjálst)",
      placeholder: "t.d. Reykjavík",
      icon: "MapPin"
    }
  },
  buttons: {
    cancel: "Hætta við",
    submit: "Staðfesta skráningu",
    submitting: "Skrái..."
  },
  errors: {
    duplicate: "Þú ert þegar skráð(ur) í þetta mót",
    emailExists: "Netfang er þegar skráð fyrir annan keppanda",
    general: "Villa við skráningu. Vinsamlegast reyndu aftur."
  }
};
