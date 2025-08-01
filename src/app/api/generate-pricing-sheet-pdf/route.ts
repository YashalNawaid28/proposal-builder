import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, fileName = 'document' } = await request.json();

    const response = await axios({
      url: "https://api.docraptor.com/docs",
      method: "post",
      responseType: "arraybuffer" as const,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        user_credentials: 'bj336uFebAcxuGWoTgb4',
        doc: {
          test: process.env.NODE_ENV !== 'production',
          document_type: "pdf",
          document_content: htmlContent,
          name: `${fileName}.pdf`
        }
      }
    });

    const pdfBuffer = Buffer.from(response.data);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${fileName}.pdf`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
} 