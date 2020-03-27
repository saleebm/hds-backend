import sgMailer from '@sendgrid/mail'

// TODO: implement email sending templates.. ie switch case for implementation - reset password, new account, etc
export const sendEmail = async (
  email: string,
  code: string,
  hostname: string
): Promise<void> => {
    console.log(`code for ${email}: ${code}`)

  // todo use actual hostname!!!
  const magicLink = `${hostname}/auth/${code}`

  sgMailer.setApiKey(process.env.SENDGRID_API_KEY)

  await sgMailer.send({
    to: email,
    from: 'saleebmina@copt.dev',
    subject: `Reset your HDS account password`,
    text: `Login

Reset your password at the following link

${magicLink}

---
    `,
    html: `
    <html>
    <head>
      <title></title>
    </head>
    <body>
    <div style="background: white; color: black;">
    <h1>Reset your password.</h1>

    <p>Welcome to HDS!</p>
    
    <p><a href="${magicLink}" target="_blank">Click here to log in with this magic link ✨</a></p>

    <p>Or, if requested to provide the login code, copy and paste this temporary login code:</p>

    <pre style="padding:16px 24px;border:1px solid #eeeeee;background-color:#f4f4f4;border-radius:3px;font-family:monospace;margin-bottom:24px"><img style="display:none;width:0;height:0;color:transparent;background:transparent">${code}</pre>

    <p>Please note that this code will expire in exactly 24 hours...</p>
    
    <div style="color:#aaaaaa;margin-top:12px"><img style="display:none;width:0;height:0;color:transparent;background:transparent">If you didn't expect this email, you can safely ignore it.</div>
    </div>
    </body>
  </html>
    `,
  })
}
