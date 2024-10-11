import fattureInCloudSdk from "@fattureincloud/fattureincloud-js-sdk";
import { getCityTax, getNotes } from "../../config/config.js";

export const createNewReceipt = async (reservationInfo, receiptCount) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();

    //Get the Reservation Date
    const checkInDate = reservationInfo.checkIn.split("T")[0];
    const checkOutDate = reservationInfo.checkOut.split("T")[0];
    const today = new Date();
    const paidAt =
      reservationInfo.money.payments.status == "SUCCEEDED"
        ? reservationInfo.money.payments.paidAt.split("T")[0]
        : null;

    //Guest Info
    let entity = new fattureInCloudSdk.Entity();
    entity.name = reservationInfo.guest.fullName;

    //Receipt Info
    let receipt = new fattureInCloudSdk.IssuedDocument();
    receipt.type = new fattureInCloudSdk.IssuedDocumentType().receipt;
    receipt.entity = entity;
    receipt.date = today.toISOString().split("T")[0];
    receipt.number = receiptCount;
    receipt.numeration = "/R";
    receipt.subject = `Canone di Locazione ${reservationInfo.listing.address.full} dal ${checkInDate} al ${checkOutDate} - Prenotazione N° ${reservationInfo.confirmationCode}`;
    receipt.currency = {
      id: reservationInfo.money.currency,
    };
    receipt.language = {
      code: "it",
      name: "Italiano",
    };
    let notes = await getNotes(reservationInfo);
    notes = notes.replaceAll("\n", "<br>");
    receipt.notes = notes;
    // console.log("Notes ", receipt.notes);
    const cityTax = getCityTax(reservationInfo);
    receipt.items_list = [
      {
        name: receipt.subject, //description
        net_price: cityTax.flag
          ? reservationInfo.money.hostPayout - cityTax.amount
          : reservationInfo.money.hostPayout,
        category: "cucina",
        discount: 0,
        qty: 1,
        vat: {
          id: 46,
        },
      },
    ];

    receipt.payments_list = [
      {
        amount: cityTax.flag
          ? reservationInfo.money.hostPayout - cityTax.amount
          : reservationInfo.money.hostPayout,
        due_date: checkOutDate,
        paid_date: paidAt,
        status: reservationInfo.money.isFullyPaid ? "paid" : "not_paid",
        payment_account: {
          id: 150363,
        },
      },
    ];
    receipt.template = {
      id: 2821,
    };

    // Here we put our receipt in the request object
    let createIssuedDocumentRequest =
      new fattureInCloudSdk.CreateIssuedDocumentRequest();
    createIssuedDocumentRequest.data = receipt;

    let opts = {
      createIssuedDocumentRequest: createIssuedDocumentRequest,
    };

    // Now we are all set for the final call
    // Create the invoice: https://github.com/fattureincloud/fattureincloud-js-sdk/blob/master/docs/IssuedDocumentsApi.md#createIssuedDocument
    const result = await apiInstance.createIssuedDocument(companyId, opts);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const updateReceipt = async (
  reservationInfo,
  invoiceInfo,
  documentId
) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();

    //Get the Reservation Date
    const checkInDate = reservationInfo.checkIn.split("T")[0];
    const checkOutDate = reservationInfo.checkOut.split("T")[0];
    const today = new Date();
    const paidAt =
      reservationInfo.money.payments.status == "SUCCEEDED"
        ? reservationInfo.money.payments.paidAt.split("T")[0]
        : null;

    //Guest Info
    let entity = new fattureInCloudSdk.Entity();
    entity.name = invoiceInfo.name + " " + invoiceInfo.surname;
    entity.address_extra = invoiceInfo.address;
    entity.email = invoiceInfo.email;
    if (invoiceInfo.country !== "Italy") entity.country = invoiceInfo.country;
    entity.first_name = invoiceInfo.name;
    entity.last_name = invoiceInfo.surname;

    //Receipt Info
    let receipt = new fattureInCloudSdk.IssuedDocument();
    receipt.type = new fattureInCloudSdk.IssuedDocumentType().receipt;
    receipt.entity = entity;
    receipt.date = today.toISOString().split("T")[0];
    receipt.subject = `Canone di Locazione ${reservationInfo.listing.address.full} dal ${checkInDate} al ${checkOutDate} - Prenotazione N° ${reservationInfo.confirmationCode}`;
    receipt.currency = {
      id: reservationInfo.money.currency,
    };
    receipt.language = {
      code: "it",
      name: "Italiano",
    };
    let notes = await getNotes(reservationInfo);
    notes = notes.replaceAll("\n", "<br>");
    receipt.notes = notes;
    // console.log("Notes ", receipt.notes);
    const cityTax = getCityTax(reservationInfo);
    receipt.items_list = [
      {
        name: receipt.subject, //description
        net_price: cityTax.flag
          ? reservationInfo.money.hostPayout - cityTax.amount
          : reservationInfo.money.hostPayout,
        category: "cucina",
        discount: 0,
        qty: 1,
        vat: {
          id: 46,
        },
      },
    ];
    if (invoiceInfo.cityTax != 0) {
      receipt.items_list.push({
        name: "Tassa di soggiorno ed oneri riscossione", //description
        net_price: invoiceInfo.cityTax,
        category: "cucina",
        discount: 0,
        qty: 1,
        vat: {
          id: 46,
        },
      });
    }

    receipt.payments_list = [
      {
        amount: cityTax.flag
          ? Number(reservationInfo.money.hostPayout - cityTax.amount) +
            Number(invoiceInfo.cityTax)
          : Number(reservationInfo.money.hostPayout) +
            Number(invoiceInfo.cityTax),
        due_date: checkOutDate,
        paid_date: paidAt,
        status: reservationInfo.money.isFullyPaid ? "paid" : "not_paid",
        payment_account: {
          id: 150363,
        },
      },
    ];

    receipt.template = {
      id: 2821,
    };

    // Here we put our receipt in the request object
    let modifyIssuedDocumentRequest =
      new fattureInCloudSdk.ModifyIssuedDocumentRequest();
    modifyIssuedDocumentRequest.data = receipt;

    let opts = {
      modifyIssuedDocumentRequest: modifyIssuedDocumentRequest,
    };

    // Now we are all set for the final call
    // Create the invoice: https://github.com/fattureincloud/fattureincloud-js-sdk/blob/master/docs/IssuedDocumentsApi.md#createIssuedDocument
    const result = await apiInstance.modifyIssuedDocument(
      companyId,
      documentId,
      opts
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const deleteReceipt = async (documentId) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();

    const result = await apiInstance.deleteIssuedDocument(
      companyId,
      documentId
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const createInvoice = async (
  reservationInfo,
  invoiceInfo,
  invoiceNumber
) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();

    //Get the Reservation Date
    const checkInDate = reservationInfo.checkIn.split("T")[0];
    const checkOutDate = reservationInfo.checkOut.split("T")[0];
    const today = new Date();
    const paidAt =
      reservationInfo.money.payments.status == "SUCCEEDED"
        ? reservationInfo.money.payments.paidAt.split("T")[0]
        : null;

    //Guest Info
    let entity = new fattureInCloudSdk.Entity();
    entity.name = invoiceInfo.companyName;
    entity.address_extra = invoiceInfo.address;
    entity.email = invoiceInfo.email;
    if (invoiceInfo.country !== "Italy") entity.country = invoiceInfo.country;
    entity.certified_email = invoiceInfo.pecAddress;
    entity.first_name = invoiceInfo.name;
    entity.last_name = invoiceInfo.surname;
    entity.vat_number = invoiceInfo.vat;
    entity.tax_code = invoiceInfo.billingCode;

    //Invoice Info
    let invoice = new fattureInCloudSdk.IssuedDocument();
    invoice.type = new fattureInCloudSdk.IssuedDocumentType().invoice;
    invoice.number = invoiceNumber;
    invoice.numeration = "/E";
    invoice.entity = entity;
    invoice.date = today.toISOString().split("T")[0];
    invoice.subject = `Canone di Locazione ${reservationInfo.listing.address.full} dal ${checkInDate} al ${checkOutDate} - Prenotazione N° ${reservationInfo.confirmationCode}`;
    invoice.currency = {
      id: reservationInfo.money.currency,
    };
    invoice.language = {
      code: "it",
      name: "Italiano",
    };

    invoice.e_invoice = true;

    invoice.ei_data = {
      payment_method: "MP01",
    };
    let notes = await getNotes(reservationInfo);
    notes = notes.replaceAll("\n", "<br>");
    invoice.notes = notes;
    // console.log("Notes ", invoice.notes);
    const cityTax = getCityTax(reservationInfo);
    invoice.items_list = [
      {
        name: invoice.subject, //description
        net_price: cityTax.flag
          ? reservationInfo.money.hostPayout - cityTax.amount
          : reservationInfo.money.hostPayout,
        category: "cucina",
        discount: 0,
        qty: 1,
        vat: {
          id: 46,
        },
      },
    ];
    if (invoiceInfo.cityTax != 0) {
      invoice.items_list.push({
        name: "Tassa di soggiorno ed oneri riscossione", //description
        net_price: invoiceInfo.cityTax,
        category: "cucina",
        discount: 0,
        qty: 1,
        vat: {
          id: 46,
        },
      });
    }

    invoice.payments_list = [
      {
        amount: cityTax.flag
          ? Number(reservationInfo.money.hostPayout - cityTax.amount) +
            Number(invoiceInfo.cityTax)
          : Number(reservationInfo.money.hostPayout) +
            Number(invoiceInfo.cityTax),
        due_date: checkOutDate,
        paid_date: paidAt,
        status: reservationInfo.money.isFullyPaid ? "paid" : "not_paid",
        payment_account: {
          id: 150363,
        },
      },
    ];

    invoice.template = {
      id: 2821,
    };

    // Here we put our invoice in the request object
    let createIssuedDocumentRequest =
      new fattureInCloudSdk.CreateIssuedDocumentRequest();
    createIssuedDocumentRequest.data = invoice;

    let opts = {
      createIssuedDocumentRequest: createIssuedDocumentRequest,
    };

    // Now we are all set for the final call
    // Create the invoice: https://github.com/fattureincloud/fattureincloud-js-sdk/blob/master/docs/IssuedDocumentsApi.md#createIssuedDocument
    const result = await apiInstance.createIssuedDocument(companyId, opts);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getDocument = async (documentId) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();
    const result = await apiInstance.getIssuedDocument(companyId, documentId);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const sendEmail = async (documentNumber, documentId, invoiceInfo) => {
  try {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;

    //set your access token
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;
    const companyId = process.env.COMPANY_ID;

    //Create a Instance IssuedDocument API
    let apiInstance = new fattureInCloudSdk.IssuedDocumentsApi();

    let scheduleEmailRequest = new fattureInCloudSdk.ScheduleEmailRequest();

    const title =
      invoiceInfo.isIndividual === "individual"
        ? invoiceInfo.name + " " + invoiceInfo.surname
        : invoiceInfo.companyName;
    scheduleEmailRequest.data = {
      sender_email: "no-reply@fattureincloud.it",
      recipient_email: invoiceInfo.email,
      subject: `Nostra ${documentNumber}`,
      body: `Gentile ${title},<br> per visualizzare la nostra ${documentNumber} o per scaricarne una copia in versione PDF prema sul bottone sottostante.<br><br>{{allegati}}<br><br>Cordiali saluti,<br><b>Medistart srl</b>`,
      include: {
        document: true,
        delivery_note: false,
        attachment: false,
        accompanying_invoice: false,
      },
      attach_pdf: false,
      send_copy: false,
    };
    let opts = {
      scheduleEmailRequest: scheduleEmailRequest,
    };
    const result = await apiInstance.scheduleEmail(companyId, documentId, opts);
    return result;
  } catch (err) {
    console.log(err);
  }
};
