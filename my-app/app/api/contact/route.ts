// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase/supaBaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const { name, email, type, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
        .from("contact_submissions")
        .insert([{ name, email, type, message }]);

    if (dbError) {
        console.error("DB insert error:", dbError.message);
    }

    // Send styled email to Gmail
    const { error: emailError } = await resend.emails.send({
        from: "OSW Contact <onboarding@resend.dev>",
        to: "nonsaker021@gmail.com",
        subject: `[OSW] ${type?.toUpperCase()} — ${name?.toUpperCase()}`,
        replyTo: email,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OSW Contact</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111111;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;border-bottom:2px solid #111111;">
              <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#888888;">Official StreetWear</p>
              <h1 style="margin:10px 0 0;font-size:32px;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;color:#111111;">OSW.</h1>
            </td>
          </tr>

          <!-- Section label -->
          <tr>
            <td style="padding:40px 0 28px;">
              <p style="margin:0;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#aaaaaa;">New Inquiry Received</p>
              <h2 style="margin:10px 0 0;font-size:18px;font-weight:300;letter-spacing:0.12em;text-transform:uppercase;color:#111111;">Contact Form Submission</h2>
            </td>
          </tr>

          <!-- Fields -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td style="padding:18px 0;border-top:1px solid #e5e5e5;">
                    <p style="margin:0 0 6px;font-size:8px;letter-spacing:0.25em;text-transform:uppercase;color:#aaaaaa;">Name</p>
                    <p style="margin:0;font-size:15px;font-weight:400;letter-spacing:0.02em;color:#111111;">${name}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 0;border-top:1px solid #e5e5e5;">
                    <p style="margin:0 0 6px;font-size:8px;letter-spacing:0.25em;text-transform:uppercase;color:#aaaaaa;">Email</p>
                    <a href="mailto:${email}" style="font-size:15px;font-weight:400;letter-spacing:0.02em;color:#111111;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 0;border-top:1px solid #e5e5e5;">
                    <p style="margin:0 0 6px;font-size:8px;letter-spacing:0.25em;text-transform:uppercase;color:#aaaaaa;">Inquiry Type</p>
                    <p style="margin:0;font-size:15px;font-weight:400;letter-spacing:0.02em;color:#111111;">${type}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;">
                    <p style="margin:0 0 6px;font-size:8px;letter-spacing:0.25em;text-transform:uppercase;color:#aaaaaa;">Message</p>
                    <p style="margin:0;font-size:15px;font-weight:400;letter-spacing:0.02em;color:#111111;white-space:pre-wrap;line-height:1.7;">${message}</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-top:40px;">
              <a href="mailto:${email}"
                 style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;padding:18px 36px;">
                Reply to ${name} &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e5e5e5;padding-top:24px;">
                    <p style="margin:0;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#bbbbbb;">OSW &nbsp;&mdash;&nbsp; Official StreetWear</p>
                    <p style="margin:6px 0 0;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#cccccc;">Bogo City, Cebu, Philippines &nbsp;6010</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
        `,
    });

    if (emailError) {
        console.error("Email send error:", emailError.message);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}