interface JobData {
  jobName?: string;
  jobNumber?: string;
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

export function generatePricingSheetHTML(
  jobData: JobData,
  clientData: ClientData,
  pricingData: PricingData,
  versionInfo: { version_no: number; revision_no: number }
): string {
  // Calculate totals
  const fabricationSubtotal = pricingData.lines.reduce((sum, line) => sum + (line.list_price || 0), 0);
  const installationSubtotal = pricingData.lines.reduce((sum, line) => sum + (line.list_install_price || 0), 0);
  const fabricationBudget = pricingData.lines.reduce((sum, line) => sum + (line.cost_budget || 0), 0);
  const installationBudget = pricingData.lines.reduce((sum, line) => sum + (line.cost_install_budget || 0), 0);
  const jobPriceTotal = fabricationSubtotal + installationSubtotal;
  const jobBudgetTotal = fabricationBudget + installationBudget;

  // Format date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  });

  // For now, we'll embed the template directly
  // In a production environment, you'd want to read this from the server
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
        font-size: 9pt;
        font-family: Arial, sans-serif;
        content: element(footer);
      }
    }

    p, h1, h2, h3, h4, h5, h6 {
      margin: 0;
    }

    #header {
      position: running(header);
      display: flex;
      justify-content: space-between;
      align-items: start;
      background-color: #fff;
      padding: 24px;
    }

    .left {
      display: flex;
      align-items: start;
      gap: 6px;
    }

    .right {
      display: flex;
      height: 100%;
      color: var(--Gray-950, #0C111D);
      text-align: center;
      font-family: Inter;
      font-size: 9.6px;
      font-style: normal;
      font-weight: 400;
      line-height: 14.4px;
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

    #footer {
      position: running(footer);
      width: 100%;
      font-size: 8pt;
      text-align: center;
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
      border-collapse: separate;
      border-spacing: 0;
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
      border-bottom: 1px solid #e5e7eb;
    }

    .custom-table td {
      padding: 16px 8px;
      vertical-align: middle;
      color: #23272f;
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
      margin-top: 20px;
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
      <img style="display: flex; width: 80px; height: 75px; justify-content: center; align-items: center;"
        src="https://bqobctrcfgearocxjhxr.supabase.co/storage/v1/object/public/images//Round%20Channel%20Logo%20(1).svg" />

      <div
        style="color: var(--Gray-900, #101828); font-family: Inter; font-style: normal; display: flex; flex-direction: column; gap: 8px;">
        <h1 style=" font-size: 18px; font-weight: 700; line-height: 24px;">
          Pricing Sheet
        </h1>
        <p style="font-size: 11px; font-weight: 400; line-height: 16px; margin-top: 4px;">
          {{version_info}}
        </p>
        <h3 style="font-size: 13.5px; font-weight: 600; line-height: 21px;">
          {{job_name}} - {{job_location}} ({{job_number}})
        </h3>
      </div>
    </div>

    <div class="right">
      <p>{{current_date}}</p>
    </div>

  </div>
  <!-- Page 1 Content -->
  <div class="content" style="position: relative;">

    <div class="page-container">
      <div class="page-body">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 30px;">Qty.</th>
              <th style="width: 70px;">Sign</th>
              <th>Manufacture and install the following</th>
              <th style="width: 100px;" class="text-right">Fab Price</th>
              <th style="width: 100px;" class="text-right">Fab Budget</th>
              <th style="width: 100px;" class="text-right">Install Price</th>
              <th style="width: 100px;" class="text-right">Install Budget</th>
            </tr>
          </thead>
          <tbody>
            {{line_items}}
          </tbody>
        </table>
      </div>
    </div>

    <div id="footer" class="footer"
      style="display: flex; flex-direction: column;background: #f7f8fa; height: fit-content;">
      <div
        style="display: flex; justify-content: space-between; align-items: flex-start; padding: 30px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #23272f;">
        <div style="text-align: left">
          <div style="margin-bottom: 4px; color: #281020; font-size: 12px; font-style: normal; font-weight: 600;
                    line-height: normal; text-align: left;">Budget Summary</div>
          <table style="width: 100%; border-top: 1px solid #D0D5DD; border-bottom: 1px solid #D0D5DD;">
            <tr>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                Installation Subtotal</td>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                {{installation_subtotal}}</td>
            </tr>
            <tr>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                Fabrication Subtotal</td>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                {{fabrication_subtotal}}</td>
            </tr>
          </table>

          <div>
            <div
              style="color: var(--Gray-900, #101828); text-align: right; font-family: Inter; font-size: 13.5px; font-style: normal; font-weight: 600;line-height: 21px;">
              Job Budget Total</div>
            <div
              style="color: var(--Gray-900, #101828); text-align: right; font-family: Inter; font-size: 18px; font-style: normal; font-weight: 700; line-height: 24px">
              {{job_budget_total}}</div>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="margin-bottom: 4px; color: #281020; font-size: 12px; font-style: normal; font-weight: 600;
                    line-height: normal; text-align: left;">Price Summary</div>
          <table style="width: 100%; border-top: 1px solid #D0D5DD; border-bottom: 1px solid #D0D5DD;">
            <tr>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                Installation Subtotal</td>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                {{installation_subtotal}}</td>
            </tr>
            <tr>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                Fabrication Subtotal</td>
              <td
                style="color: var(--Gray-600, #475467);  font-family: Inter; font-size: 10.5px; font-style: normal; font-weight: 400; line-height: 15px;">
                {{fabrication_subtotal}}</td>
            </tr>
          </table>

          <div>
            <div
              style="color: var(--Gray-900, #101828); text-align: right; font-family: Inter; font-size: 13.5px; font-style: normal; font-weight: 600;line-height: 21px;">
              Job Price Total</div>
            <div
              style="color: var(--Gray-900, #101828); text-align: right; font-family: Inter; font-size: 18px; font-style: normal; font-weight: 700; line-height: 24px">{{job_price_total}}</div>
          </div>
        </div>
      </div>
    </div>

    <div style="clear: both;"></div>
  </div>

  <!-- Page Break -->
  <div style="page-break-after: always;"></div>
</body>

</html>`;

  // Replace template variables
  template = template.replace('{{job_name}}', jobData.jobName || 'N/A');
  template = template.replace('{{job_number}}', jobData.jobNumber || 'N/A');
  template = template.replace('{{job_location}}', jobData.jobLocation || 'N/A');
  template = template.replace('{{client_name}}', clientData.clientName || 'N/A');
  template = template.replace('{{client_location}}', clientData.clientLocation || 'N/A');
  template = template.replace('{{client_contact}}', clientData.clientContact || 'N/A');
  template = template.replace('{{client_phone}}', clientData.clientPhone || 'N/A');
  template = template.replace('{{current_date}}', currentDate);
  template = template.replace('{{version_info}}', `v${versionInfo.version_no}.${versionInfo.revision_no}`);
  template = template.replace('{{installation_subtotal}}', `$${installationSubtotal.toFixed(2)}`);
  template = template.replace('{{fabrication_subtotal}}', `$${fabricationSubtotal.toFixed(2)}`);
  template = template.replace('{{job_price_total}}', `$${jobPriceTotal.toFixed(2)}`);
  template = template.replace('{{job_budget_total}}', `$${jobBudgetTotal.toFixed(2)}`);

  // Generate line items HTML
  const lineItemsHTML = pricingData.lines.map(line => {
    const signImage = line.signs?.sign_image || '';
    const signLabel = line.signs?.sign_name || 'Sign';
    
    return `
    <tr>
      <td>${line.qty || 1}</td>
      <td>
        ${signImage ? 
          `<img class="sign-img" src="${signImage}" alt="${signLabel}" />` : 
          `<span class="sign-label">${signLabel}</span>`
        }
      </td>
      <td>${line.description_resolved || 'No description'}</td>
      <td class="text-right">$${(line.list_price || 0).toFixed(2)}</td>
      <td class="text-right">$${(line.cost_budget || 0).toFixed(2)}</td>
      <td class="text-right">$${(line.list_install_price || 0).toFixed(2)}</td>
      <td class="text-right">$${(line.cost_install_budget || 0).toFixed(2)}</td>
    </tr>
    `;
  }).join('');

  // Replace the line items placeholder
  template = template.replace('{{line_items}}', lineItemsHTML);

  return template;
} 