interface JobData {
  jobName?: string;
  jobNumber?: string;
  proposalNumber?: string;
  jobLocation?: string;
  brandName?: string;
  creatorName?: string;
  pmName?: string;
  createdDate?: string;
}

interface ClientData {
  clientName?: string;
  clientLocation?: string;
  clientContact?: string;
  clientPhone?: string;
}

interface PricingLine {
  qty: number;
  signs?: {
    sign_name?: string;
    sign_image?: string;
  };
  description_resolved?: string;
  list_price?: number;
  list_install_price?: number;
  cost_budget?: number;
  cost_install_budget?: number;
}

interface PricingData {
  lines: PricingLine[];
}

export function generateProposalHTML(
  jobData: JobData,
  clientData: ClientData,
  pricingData: PricingData,
  versionInfo: { version_no: number; revision_no: number }
): string {
  // Calculate totals
  const jobSubtotal = pricingData.lines.reduce((sum, line) => sum + (line.list_price || 0), 0);
  const tax = jobSubtotal * 0.10; // 10% tax
  const jobTotal = jobSubtotal + tax;

  // Format date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  });

  // Embed the actual proposal template content
  let template = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Visible Graphics Contract</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend:wght@100..900&display=swap"
    rel="stylesheet">
  <style>
    body {
      font-family: Inter, sans-serif;
      font-size: 10.5pt;
      line-height: 1.2;
      color: #000;
      margin: 0;
      padding: 0;
    }

    @page {
      size: Letter;
      margin: 2.2cm 0 5cm 0;
      counter-increment: page;

      @top-left {
        content: element(header);
      }

      @bottom-center {
        content: element(footer-page1);
      }
    }

    @page page2 {
      size: Letter;
      margin: 2.2cm 0 5cm 0;
      counter-increment: page;

      @top-left {
        content: element(header);
      }

      @bottom-center {
        content: element(footer-page2);
      }
    }

    @page page3 {
      size: Letter;
      margin: 2.2cm 0 0 0;
      counter-increment: page;

      @top-left {
        content: element(header);
      }

      @bottom-center {
        content: element(footer-page3);
      }
    }

    p, h1, h2, h3, h4, h5, h6 {
      margin: 0;
    }

    #header {
      position: running(header);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #000;
      padding-left: 30px;
      font-family: 'Arial', sans-serif;
      color: white;
      height: 82px;
    }

    #footer-page1 {
      position: running(footer-page1);
      width: 100%;
      font-size: 8pt;
      text-align: center;
    }

    #footer-page2 {
      position: running(footer-page2);
      width: 100%;
      font-size: 8pt;
      text-align: center;
    }

    #footer-page3 {
      position: running(footer-page3);
      width: 100%;
      font-size: 8pt;
      text-align: center;
    }

    .left {
      display: flex;
      align-items: center;
    }

    .visible-logo {
      height: 54px;
      width: 134px;
      object-fit: contain;
      margin-right: 12px;
    }

    .left-text .title {
      font-size: 16px;
      letter-spacing: 1.5px;
      font-weight: bold;
    }

    .left-text .subtitle {
      font-size: 11px;
      color: #ccc;
      margin-top: 2px;
    }

    .right {
      background-color: #d10a2d;
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
      padding: 0 20px 0 10px;
      display: flex;
      align-items: center;
      height: 100%;
    }

    .right-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .daves-logo {
      width: 59px;
      height: 58px;
      object-fit: cover;
    }

    .proposal-text {
      font-size: 20px;
      font-weight: bold;
      color: white;
    }



    h1 {
      font-size: 13pt;
      font-weight: bold;
      padding: 0;
    }

    h2 {
      font-size: 11pt;
      font-weight: bold;
      padding: 0;
    }

    .page-counter {
      color: #000;
      text-align: center;
      font-family: Inter;
      font-size: 10px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .page-counter::before {
      content: counter(page) " / " counter(pages);
    }

    .info {
      display: flex;
      gap: 32px;
      background: #f7f8fa;
      padding: 16px 0;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      color: #23272f;
    }

    .info>div {
      flex: 1;
      padding: 0 16px;
    }

    .info>div:not(:first-child) {
      border-left: 2px solid #e5e7eb;
    }

    .info strong {
      display: block;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #23272f;
    }

    .info div>div {
      margin-bottom: 2px;
    }

    .client-info {
      margin-bottom: 12px;
    }

    .client-info div {
      margin-bottom: 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 10.5pt;
    }

    th {
      text-align: left;
      padding: 3px 5px;
      border-bottom: 1px solid #000;
      font-weight: bold;
    }

    td {
      padding: 3px 5px;
      vertical-align: top;
    }

    .text-right {
      text-align: right;
    }

    hr {
      border: 0;
      border-top: 1px solid #000;
      margin: 15px 0;
    }

    .signature-section {
      margin-top: 25px;
    }

    .signature-line {
      display: inline-block;
      width: 300px;
      border-top: 1px solid #000;
      margin-right: 30px;
      padding-top: 3px;
      color: #281020;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .page-number {
      text-align: center;
      font-size: 9pt;
      margin-top: 15px;
    }

    .no-break {
      page-break-inside: avoid;
    }

    .terms-list {
      list-style-type: upper-alpha;
      padding-left: 0;
      margin-left: 0;
    }

    .terms-list li {
      padding-left: 0;
      margin-left: 16px;
      margin-bottom: 8px;
      color: #475467;
      font-family: Inter;
      font-size: 7px;
      font-style: normal;
      font-weight: 400;
      line-height: 9.3px;
      letter-spacing: -0.14px;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .custom-table thead th {
      background: #111217;
      color: #fff;
      font-weight: 600;
      padding: 12px 8px;
      text-align: left;
      border: none;
    }

    .custom-table tbody tr {
      background: #fff;
      border-bottom: 0.6px solid #D0D5DD;
    }

    .custom-table tbody tr:last-child {
      border-bottom: none;
    }

    .custom-table td {
      padding: 16px 8px;
      vertical-align: middle;
      color: #475467;
      font-family: Inter;
      font-size: 8px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
      border-bottom: 1px solid #D0D5DD;
    }

    .custom-table tbody tr:last-child td {
      border-bottom: none;
    }

    .custom-table .sign-label {
      display: inline-block;
      background: #e11d2a;
      color: #fff;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .custom-table .sign-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #e5e7eb;
    }

    .custom-table .text-right {
      text-align: right;
    }

    .page-container {
      display: table;
      height: 100%;
      width: 100%;
    }

    .page-body {
      display: table-row;
      height: 100%;
    }
  </style>
</head>

<body>
  <!-- Header -->
  <div id="header">
    <div class="left">
      <img src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Logo%20(1).svg" />
    </div>

    <div class="right">
      <div class="right-content">
        <img
          src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Round%20Channel%20Logo%20(1).svg"
          alt="Daves Hot Chicken Logo" class="daves-logo" />
        <span class="proposal-text">Proposal</span>
      </div>
    </div>
  </div>
  <!-- Page 1 Content - Can auto-create new pages based on data -->
  <div class="content" style="position: relative;">

    <div class="info" style="display: flex; gap: 32px;">
      <div style="flex: 1;">
        <strong
          style="color: #281020;font-family: Inter;font-size: 12px;font-style: normal;font-weight: 600;line-height: normal;">Billing
          Info</strong>
        <div style="display: flex;flex-direction: column;gap: 2px">
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{billing_name}}</p>
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{billing_address}}</p>
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{billing_city_state_zip}}</p>
          <div style="display: flex; align-items: center; color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">
            <h5 style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 600; line-height: 15px;">Phone: </h5> {{billing_phone}}
          </div>
          <div style="display: flex; align-items: center; color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">
            <h5 style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 600; line-height: 15px;">Attn: </h5> {{billing_attn}}
          </div>
        </div>
      </div>
      <div style="flex: 1;">
        <strong
          style="color: #281020;font-family: Inter;font-size: 12px;font-style: normal;font-weight: 600;line-height: normal;">Job
          Info</strong>
        <div style="display: flex;flex-direction: column;gap: 2px">
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{job_name}}</p>
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{job_location}}</p>
          <p style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">{{job_address}}</p>
        </div>
      </div>
      <div style="flex: 1;">
        <strong
          style="color: #281020;font-family: Inter;font-size: 12px;font-style: normal;font-weight: 600;line-height: normal;">Contract
          Info</strong>
        <div style="display: flex;flex-direction: column;gap: 2px">
          <div style="display: flex; align-items: center; color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">
            <h5 style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 600; line-height: 15px;">Date: </h5> {{contract_date}}
          </div>
          <div style="display: flex; align-items: center; color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">
            <h5 style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 600; line-height: 15px;">Proposal #: </h5> {{contract_number}}
          </div>
          <div style="display: flex; align-items: center; color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400; line-height: 15px;">
            <h5 style="color: #475467; font-family: Inter; font-size: 9px; font-style: normal; font-weight: 600; line-height: 15px;">Representative :</h5> {{contract_rep}}
          </div>
        </div>
      </div>
    </div>
    <div class="page-container">
      <div class="page-body">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 30px;">Qty.</th>
              <th style="width: 70px;">Sign</th>
              <th>Manufacture and install the following</th>
              <th style="width: 100px;" class="text-right">Unit Price</th>
              <th style="width: 100px;" class="text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {{line_items}}
          </tbody>
        </table>
      </div>
    </div>

    <div id="footer-page1" class="footer" style="display: flex; flex-direction: column;background: #f7f8fa; height: fit-content;">
      <div
        style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #23272f;">
        <div style="flex: 2;text-align: left">
          <div style="margin-bottom: 4px; color: #281020; font-size: 12px; font-style: normal; font-weight: 600;
                    line-height: normal;">Terms</div>
          <div style="margin-bottom: 16px; text-align: left;">
            <p style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">50% Deposit due at time of acceptance. Balance due at time of
              shipping.</p>
            <p style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">This contract is subject to ten terms and conditions included in
              the subsequent pages.</p>
          </div>
          <h4 style="margin-bottom: 4px; color: #281020; font-size: 12px; font-style: normal; font-weight: 600;
                    line-height: normal;">Contact Info</h4>
          <p style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">9736 Eton Avenue Chatsworth, CA 91311</p>
          <p style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">
                        T 818.787.0477 F 818.787.0415 WWW.VISIBLEGRAPHICS.COM
                    </p>
                </div>
                <div style=" flex: 1; text-align: right;">
          <div style="margin-bottom: 4px; color: #281020; font-size: 12px; font-style: normal; font-weight: 600;
                    line-height: normal; text-align: left;">Summary</div>
          <table style="width: 100%; border-top: 1px solid #D0D5DD; border-bottom: 1px solid #D0D5DD;">
            <tr>
              <td style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">Job Subtotal</td>
              <td style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px; text-align: right;">{{job_subtotal}}</td>
            </tr>
            <tr>
              <td style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px;">Tax (10%)</td>
              <td style="color: #475467;  font-family: Inter; font-size: 9px; font-style: normal; font-weight: 400;
                        line-height: 15px; text-align: right;">{{tax}}</td>
            </tr>
          </table>

          <div>
            <div style="color: #281020; text-align: right; font-family: Inter; font-size: 12px; font-style: normal; font-weight: 600;
                        line-height: normal;">Job Total</div>
            <div style="color: #281020; text-align: right; font-family: Inter; font-size: 16px; font-style: normal; font-weight: 700;
                        line-height: 24px; text-align: right;">{{job_total}}</div>
          </div>

        </div>
      </div>
      <div
        style="width: fit-content; border: none; background: #EAECF0; border-radius: 3px; align-self: center; display: inline-block; padding: 2px 12px; text-align: center; position: absolute;bottom: 8px; justify-self: anchor-center;"
        class="page-counter">
      </div>
    </div>

    <div style="clear: both;"></div>
  </div>

  <!-- Page 2 Content - Always a new page -->

  <div class="content" style="page: page2;">
  <div id="header">
    <div class="left">
      <img src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Logo%20(1).svg" />
    </div>

    <div class="right">
      <div class="right-content">
        <img
          src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Round%20Channel%20Logo%20(1).svg"
          alt="Daves Hot Chicken Logo" class="daves-logo" />
        <span class="proposal-text">Proposal</span>
      </div>
    </div>
  </div>

  <div class="content" style="padding: 16px; position: relative;">
    <div class="page-container">
      <div class="page-body">
        <h2
          style="color: #281020; font-family: Inter; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;">
          Delivery & Installation</h2>
        <p style="color: #475467; font-family: Inter; font-size: 7px; font-style: normal; font-weight: 400; line-height: 9.3px;
        letter-spacing: -0.14px;">Agroximate number of working days after permits have been obtained: 2-3 Weeks</p>

        <h2
          style="color: #281020; font-family: Inter; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal; margin-top: 16px">
          Seller / Visible Graphics</h2>
        <ul class="terms-list">
          <li>Seller retains title to the advice-described advertising display until buyer has performed all
            of
            buyer's obligations under this agreement and the purchase price of the advertising display has
            been
            fully paid.</li>
          <li>Sign permits and permit services fees are not included in the contract unless otherwise noted
            these fees
            will be billed at actual cost upon obtaining the permits.</li>
          <li>If removal of existing signage has been quoted, price includes patch & painting of holes left
            from
            existing signage (V&L).</li>
          <li>Price does not include Permits, Procurement, Shipping or Engineering if required) and will be
            billed
            upon completion. Price includes installation.</li>
          <li>Additional cost will be incurred if: Entire sign board will require painting or bringing the
            sign board
            to "the new condition" or site is not ready to accept signage at time of scheduled installation.
          </li>
        </ul>
      </div>
    </div>


    <div id="footer-page2" class="footer" style="display: flex; flex-direction: column;background: #f7f8fa;">
      <div
        style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #23272f;">
        <div style="flex: 2;text-align: left">
          <div style="font-weight: 400; margin-bottom: 4px; font-size: 10px; color: #281020;">Buyer WKS
            Restaurant
            Group</div>
          <div style="margin-bottom: 16px; text-align: left;">
            <p style="font-weight: 400; color: #475467; font-size: 9px; line-height: 15px;">The undersigned
              guarantees prompt payment, on or before the due date, of all sums to become due under the
              foregoing agreement, waivers notice of default by the principal obligor,and waivers any
              requirement that the firm to whom this guaranty is given, or its successors or assigns, seek
              recovery from the principal, as a condition concurrent or precedent to action on this
              guaranty.
              All default and litigation provisions of the foregoing agreement apply to this guaranty, and
              the
              undersigned hereby waivers notice of and agrees to, any extensions of time of payment which
              may
              hereafter be granted the principal.r</p>
          </div>
          <div class="signature-section no-break">
            <div class="signature-line">Signature</div>
            <div class="signature-line">Date</div>
          </div>
        </div>
      </div>

      <div
        style="width: fit-content; border: none; background: #EAECF0; border-radius: 3px; align-self: center; display: inline-block; padding: 2px 12px; position: absolute;bottom: 8px; justify-self: anchor-center;"
        class="page-counter">
      </div>
    </div>



  </div>


  </div>

  <!-- Page 3 Content - Always a new page -->

  <div class="content" style="page: page3;">
  <div id="header">
    <div class="left">
      <img src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Logo%20(1).svg" />
    </div>

    <div class="right">
      <div class="right-content">
        <img
          src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Round%20Channel%20Logo%20(1).svg"
          alt="Daves Hot Chicken Logo" class="daves-logo" />
        <span class="proposal-text">Proposal</span>
      </div>
    </div>
  </div>

  <div class="content" style="padding: 16px; position: relative; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
    <h1
      style="color: #281020; font-family: Inter; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;">
      Additional Terms and Conditions</h1>

    <ol class="terms-list">
      <li> <span style="font-weight: 700;">SELLER:</span> agrees to sell and Buyer agrees to purchase, subject to
        the terms and conditions hereinafter set forth, an Advertising Display hereinafter called the "Display"
        in conformity with the specifications hereinafter set forth and with the approved designs, if any. (This
        Display shall at all times be deemed personal property, and shall not by reason of attachment or
        connection to any realty, become or be deemed a fixture or appurtenance to such realty). Buyer shall
        obtain the necessary permission from owner of the premises, which is requisite for the installation of
        the Display, as personal property (in writing). Buyer also agrees to secure all permissions from owner
        or landlord of the premises for which installation of Display or work is to be done. This shall be in
        writing to Seller at the time of agreement. THIS IS BUYER'S RESPONSIBILITY. Unless otherwise noted,
        Visible Graphic's normal installation is within 50 land miles from Chatsworth, California. Over 50 miles
        is considered "Out of town" install. Visible Graphics installation HOURS are BETWEEN 8:00 am - 4:30 pm
        Monday - Friday, holidays not included. Any other time or day requested will be based in overtime basis
        and will be billed at extra cost. All prices are subject to change 30 days from contract date. </li>

      <li> <span style="font-weight: 700;">WARRANTY:</span> Seller warrants the Display sold hereunder for one (1)
        year. Incandescent lamps are excluded from this warranty. This shall be the limit of Seller's liability
        for any breach of warranty. Buyer must notify Seller by registered or certified mail, return receipt
        request, postage prepaid, of any breach of warranty, within 30 days after discovery thereof, but not
        later than the expiration of the warranty period. Otherwise, such claims shall be deemed waived. Also if
        such display is serviced, repaired, opened for any reason by someone other then Visible Graphics or
        assigned agent, WARRANTY IS VOID. SELLER SPECIFICALLY DISCLAIMS ALL OTHER WARRANTIES, EXPRESSED OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
        PURPOSE. IN NO EVENT SHALL SELLER BE LIABLE FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, LOSSES OR EXPENSES,
        INCLUDING LOSS OF PROFIT.</li>

      <li> <span style="font-weight: 700;">DAMAGE:</span> Should any loss, damage or injury result to said
        Display, from any cause whatsoever, while in possession of Buyer or his agents, such loss, damage or
        injury shall not relieve the Buyer from the obligation to pay for the same according to the terms of
        this contract.</li>

      <li> <span style="font-weight: 700;">TITLE:</span> Title to Display remains with Seller until full payment
        is received, any installation prior to complete payment, being solely for the convenience of Buyer and
        Seller in testing the equipment. Should Buyer fail to pay in full within 10 days of completion of
        installation, the Seller shall have the right to either (1) retake said Display and cause the same to be
        sold in a reasonable commercial manner, and if the amount realize from such a sale together with any
        payment or payments received from Buyer shall not total the entire purchase price hereunder which shall
        include expenses for retaking possession and selling said Display, Buyer agrees to pay any such
        deficiency to Seller on demand or (2) without retaking said display, bring suit for the balance due
        under this contract. In either case, Buyer agrees to pay interest in any amounts due and owing at the
        maximum rate allowed by the law (10% minimum) and reasonable attorney fees and costs in the event that
        legal action is commenced.</li>

      <li> <span style="font-weight: 700;">PERMITS, LICENSES, FEES AND TAXES:</span> If installation is part of
        this Agreement, Buyer shall advise Seller of any governmental easements, setbacks or restrictions
        affecting the location of sign(s). Buyer shall be responsible for securing and maintaining in force all
        necessary permits from the owner of the premises upon which Display is to be installed, for all other
        private permissions necessary for the installation, use and existence of the Display, and for any
        variance permits required due to restrictions by governmental agencies. Unless otherwise specified,
        Buyer shall pay as an extra the cost of the permit service fees.</li>

      <li> <span style="font-weight: 700;">AUTHORITY OF AGENT:</span> It is further understood and agreed that
        this contract is not subject to countermand, and cancels all previous understandings either written or
        verbal, and does not become binding upon the Seller until approval by the executive officer of the
        Seller.</li>

      <li> <span style="font-weight: 700;">SERVICE WIRING:</span> COST OF ELECTRICITY: REINFORCEMENT OF BUILDING:
        PHYSICAL CONDITIONS: Buyer shall bring feed wire of suitable capacity and approved type to the location
        of Display. Unless otherwise specified, sign-operating voltage is 120 volts single-phase common house
        current. Buyer shall pay for all electric energy used by Display and shall be responsible for the supply
        thereof. Unless specifically stated in writing to the contrary, Buyer shall provide all necessary
        reinforcements to the building on which Display is installed. Buyer shall pay for cost of relocating
        power lines, for securing all building access to location of Display, or other obstacles, to comply with
        law of Federal, State, or Municipal agencies. The parties agree to adjust the extra installation cost
        based on Seller's additional cost.</li>

      <li> <span style="font-weight: 700;">FURTHER REMEDIES OF SELLER:</span> Seller may exercise any and all of
        its rights and remedies under the California Commercial Code. In addition, Seller may enter on Buyer's
        premises to take possession of, assemble and collect the display or render it unusable. All rights and
        remedies of Seller shall be cumulative and may be exercised successively or concurrently without
        impairing Seller's security interest in the Display. Seller may charge Buyer for all expenses to render
        Display useable if action to render Display useable is instituted under terms of this paragraph.</li>

      <li> <span style="font-weight: 700;">MISCELLANEOUS PROVISIONS:</span> 1) Timely payment to Seller by Buyer
        is of the essence of this agreement. 2) No waiver by either party hereto the non- performance or breach
        of any term, provision or agreement hereof, or any default hereunder, shall be construed to be or
        operate as a waiver of any subsequent non-performance or breach. 3) This agreement shall be construed in
        accordance with, and governed by, the laws of the State of California. 4) In the event this order
        relates only to labor, equipment and incidental materials required by connection with the removal and/or
        installation and/or modification and/or repair and/or storage of any advertising disolav(s),provisions
        in paragraphs A and B hereof that are enclosed in parentheses shall be deemed deleted and the "sale" and
        "purchase" shall relate to the furnishing by "Seller" of the items described herein. This agreement
        shall be deemed to have been made at the time and place when and where executed by Seller and shall
        constitute the entire agreement between the Buyer and Seller. No waivers, modifications, or amendments
        shall be valid unless executed in writing by both parties, and there are no other warranties, expressed
        or implied, with respect to the equipment and services supplied to Buyer by Seller, other than those
        expressly contained herein. 5) None of the terms and provisions of this agreement can be assigned by
        Buyer without Seller's prior written consent. 6) It is hereby declared, agreed and understood that there
        are no prior oral or written negotiations, understandings, representations or agreements between Seller
        and Buyer not herein expressed.</li>

      <li> <span style="font-weight: 700;">FINAL INSPECTION:</span> Under California state law, it is the
        obligation of the contractor that has performed the installation to obtain final inspection from the
        authority having jurisdiction. If for reasons beyond control of Visible Graphics, final inspection is
        not obtained and a special return trip is required, Buyer agrees to pay for additional labor costs
        required to return to job site to obtain final inspection from authority having jurisdiction.</li>

      <li> <span style="font-weight: 700;">CONTRACTOR'S LICENSE:</span> Contractors are required by law to be
        licensed and regulated by the Contractor's State Licensing Board, 1020 "N" Street, Sacramento, CA 95814.
        Visible Graphics, holds California Contractor's License number 745555.</li>

      <li> <span style="font-weight: 700;">NOTICE:</span> "Under the Mechanics Lien Law, any contractor,
        subcontractor, laborer or other person who helps to improve your property but IS not paid for his work
        or supplies, has a right to enforce a claim against your property. This means that after a court hearing
        your property could be sold by a court officer and the proceeds of the sale used to satisfy the
        indebtedness. This can happen even if you have paid your own contract in full, if the subcontractor,
        laborer, or supplier remains unpaid"</li>
    </ol>

  </div>

  <div id="footer-page3" style="background-color: #F2F4F7; height: 20px; padding: 10px 0; margin: 0; display: flex; justify-content: center; align-items: center; position: absolute; bottom: 0;">
      <div
        style="width: fit-content; border: none; background: #EAECF0; border-radius: 3px; padding: 2px 12px; margin: 0;"
        class="page-counter">
      </div>
    </div>
</body>

</html>`;

  // Replace template variables
  template = template.replace(/{{billing_name}}/g, clientData.clientName || 'N/A');
  template = template.replace(/{{billing_address}}/g, clientData.clientLocation || 'N/A');
  template = template.replace(/{{billing_city_state_zip}}/g, clientData.clientLocation || 'N/A');
  template = template.replace(/{{billing_phone}}/g, clientData.clientPhone || 'N/A');
  template = template.replace(/{{billing_attn}}/g, clientData.clientContact || 'N/A');
  template = template.replace(/{{job_name}}/g, jobData.jobName || 'N/A');
  template = template.replace(/{{job_location}}/g, jobData.jobLocation || 'N/A');
  template = template.replace(/{{job_address}}/g, jobData.jobLocation || 'N/A');
  template = template.replace(/{{contract_date}}/g, currentDate);
  template = template.replace(/{{contract_number}}/g, jobData.proposalNumber || jobData.jobNumber || 'N/A');
  template = template.replace(/{{contract_rep}}/g, jobData.pmName || 'N/A');
  template = template.replace(/{{job_subtotal}}/g, `$${jobSubtotal.toFixed(2)}`);
  template = template.replace(/{{tax}}/g, `$${tax.toFixed(2)}`);
  template = template.replace(/{{job_total}}/g, `$${jobTotal.toFixed(2)}`);

  // Generate line items HTML
  const lineItemsHTML = pricingData.lines.map(line => {
    const signImage = line.signs?.sign_image || '';
    const signLabel = line.signs?.sign_name || 'Sign';
    const unitPrice = line.list_price || 0;
    const totalPrice = unitPrice * (line.qty || 1);

    return `
    <tr>
      <td>${line.qty || 1}</td>
      <td>
        ${signImage ?
        `<img class="sign-img" src="${signImage}" alt="Sign Logo" />` :
        `<span class="sign-label">${signLabel}</span>`
      }
      </td>
      <td>${line.description_resolved || 'No description'}</td>
      <td class="text-right">$${unitPrice.toFixed(2)}</td>
      <td class="text-right">$${totalPrice.toFixed(2)}</td>
    </tr>
    `;
  }).join('');

  // Replace the line items placeholder
  template = template.replace(/{{line_items}}/g, lineItemsHTML);

  return template;
} 