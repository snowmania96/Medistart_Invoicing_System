import fattureInCloudSdk from "@fattureincloud/fattureincloud-js-sdk";

let defaultClient = fattureInCloudSdk.ApiClient.instance;

//set your access token
let OAuth2AuthenticationCodeFlow =
  defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
OAuth2AuthenticationCodeFlow.accessToken = process.env.FATTURE_ACCESS_TOKEN;

//
const companyId = process.env.COMPANY_ID;

export const createNewReceipt = async (reservationInfo, receiptCount) => {
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

  let entity = new fattureInCloudSdk.Entity();
  entity.name = reservationInfo.guest.fullName;
  let receipt = new fattureInCloudSdk.IssuedDocument();
  // receipt.id = 12345;
  receipt.type = new fattureInCloudSdk.IssuedDocumentType().receipt;
  receipt.entity = entity;
  receipt.date = today.toISOString().split("T")[0];
  receipt.number = receiptCount;
  receipt.numeration = "/fatt";
  receipt.subject = `Canone di Locazione ${reservationInfo.listing.address.full} dal ${checkInDate} al ${checkOutDate} - Prenotazione N° ${reservationInfo.confirmationCode}`;
  receipt.currency = {
    id: reservationInfo.money.currency,
  };
  receipt.language = {
    code: "it",
    name: "Italiano",
  };
  receipt.notes = `Attachments: <br><br>
  1) Identification of the tenant or sub-tenant
  <br><br>
  2) Rental contract concluded electronically pursuant to Legislative Decree 70/03 as per the unique code reported in the attached receipt
  <br><br>
  All attachments and the contract form an integral part of this report.
  <br><br>
  IBAN IT07U05034208000000000000603 - Banco BPM - Fil. Rovereto`;
  receipt.items_list = [
    {
      name: receipt.subject, //description
      net_price: reservationInfo.money.hostPayout,
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
      amount: reservationInfo.money.hostPayout,
      due_date: checkOutDate,
      paid_date: paidAt,
      status: reservationInfo.money.isFullyPaid ? "paid" : "not_paid",
      payment_account: {
        id: 150363,
      },
    },
  ];

  receipt.payment_method = {
    id: 2290893,
  };

  receipt.show_payment_method = true;

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
  apiInstance.createIssuedDocument(companyId, opts).then(
    (result) => {
      console.log("Successfuly created the receipt");
    },
    (error) => {
      console.error(error);
    }
  );
};

module.exports = { createNewReceipt };
