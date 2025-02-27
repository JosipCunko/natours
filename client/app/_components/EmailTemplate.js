const { CLIENT_URL } = require("../_lib/utils");

module.exports = function EmailTemplate({ subject, name, url }) {
  const styles = {
    img: {
      border: "none",
      msInterpolationMode: "bicubic",
      maxWidth: "100%",
    },
    body: {
      backgroundColor: "#f6f6f6",
      fontFamily: "sans-serif",
      WebkitFontSmoothing: "antialiased",
      fontSize: "14px",
      lineHeight: "1.4",
      margin: 0,
      padding: 0,
      msTextSizeAdjust: "100%",
      WebkitTextSizeAdjust: "100%",
    },
    table: {
      borderCollapse: "separate",
      msoTableLspace: "0pt",
      msoTableRspace: "0pt",
      width: "100%",
    },
    tableTd: {
      fontFamily: "sans-serif",
      fontSize: "14px",
      verticalAlign: "top",
    },
    body: {
      backgroundColor: "#f6f6f6",
      width: "100%",
    },
    container: {
      display: "block",
      margin: "0 auto !important",
      maxWidth: "580px",
      padding: "10px",
      width: "580px",
    },
    content: {
      boxSizing: "border-box",
      display: "block",
      margin: "0 auto",
      maxWidth: "580px",
      padding: "10px",
    },
    main: {
      background: "#ffffff",
      borderRadius: "3px",
      width: "100%",
    },
    wrapper: {
      boxSizing: "border-box",
      padding: "20px",
    },
    contentBlock: {
      paddingBottom: "10px",
      paddingTop: "10px",
    },
    footer: {
      clear: "both",
      marginTop: "10px",
      textAlign: "center",
      width: "100%",
    },
    footerText: {
      color: "#999999",
      fontSize: "12px",
      textAlign: "center",
    },
    h1: {
      color: "#000000",
      fontFamily: "sans-serif",
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      marginBottom: "30px",
      fontSize: "35px",
      fontWeight: 300,
      textAlign: "center",
      textTransform: "capitalize",
    },
    h2: {
      color: "#000000",
      fontFamily: "sans-serif",
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      marginBottom: "30px",
    },
    h3: {
      color: "#000000",
      fontFamily: "sans-serif",
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      marginBottom: "30px",
    },
    h4: {
      color: "#000000",
      fontFamily: "sans-serif",
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      marginBottom: "30px",
    },
    p: {
      fontFamily: "sans-serif",
      fontSize: "14px",
      fontWeight: "normal",
      margin: 0,
      marginBottom: "15px",
    },
    a: {
      color: "#55c57a",
      textDecoration: "underline",
    },
    btn: {
      boxSizing: "border-box",
      width: "100%",
    },
    btnTableTd: {
      paddingBottom: "15px",
    },
    btnTable: {
      width: "auto",
    },
    btnTableCellTd: {
      backgroundColor: "#ffffff",
      borderRadius: "5px",
      textAlign: "center",
    },
    btnLink: {
      backgroundColor: "#ffffff",
      border: "solid 1px #55c57a",
      borderRadius: "5px",
      boxSizing: "border-box",
      color: "#55c57a",
      cursor: "pointer",
      display: "inline-block",
      fontSize: "14px",
      fontWeight: "bold",
      margin: 0,
      padding: "12px 25px",
      textDecoration: "none",
      textTransform: "capitalize",
    },
    btnPrimaryTableTd: {
      backgroundColor: "#55c57a",
    },
    btnPrimaryLink: {
      backgroundColor: "#55c57a",
      borderColor: "#55c57a",
      color: "#ffffff",
    },
    last: {
      marginBottom: 0,
    },
    first: {
      marginTop: 0,
    },
    alignCenter: {
      textAlign: "center",
    },
    alignRight: {
      textAlign: "right",
    },
    alignLeft: {
      textAlign: "left",
    },
    clear: {
      clear: "both",
    },
    mt0: {
      marginTop: 0,
    },
    mb0: {
      marginBottom: 0,
    },
    preheader: {
      color: "transparent",
      display: "none",
      height: 0,
      maxHeight: 0,
      maxWidth: 0,
      opacity: 0,
      overflow: "hidden",
      msoHide: "all",
      visibility: "hidden",
      width: 0,
    },
    poweredBy: {
      textDecoration: "none",
    },
    hr: {
      border: 0,
      borderBottom: "1px solid #f6f6f6",
      margin: "20px 0",
    },
  };

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{subject}</title>
        {/* Media Queries could be included inline or in a styled component */}
      </head>
      <body style={styles.body}>
        <table
          role="presentation"
          border="0"
          cellPadding="0"
          cellSpacing="0"
          style={styles.table}
          className="body"
        >
          <tbody>
            <tr>
              <td></td>
              <td className="container" style={styles.container}>
                <div className="content" style={styles.content}>
                  {/* START CENTERED WHITE CONTAINER */}
                  <table
                    role="presentation"
                    className="main"
                    style={styles.main}
                  >
                    {/* START MAIN AREA */}
                    <tbody>
                      <tr>
                        <td className="wrapper" style={styles.wrapper}>
                          <table
                            role="presentation"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                            style={styles.table}
                          >
                            <tbody>
                              <tr>
                                <td style={styles.tableTd}>
                                  {/* CONTENT */}
                                  <p style={styles.p}>Hi {name},</p>
                                  <p style={styles.p}>
                                    Welcome to Natours, we&apos;re glad to have
                                    you 🎉🙏
                                  </p>
                                  <p style={styles.p}>
                                    We&apos;re all a big familiy here, so make
                                    sure to upload your user photo so we get to
                                    know you a bit better!
                                  </p>
                                  <table
                                    role="presentation"
                                    border="0"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    className="btn btn-primary"
                                    style={{ ...styles.table, ...styles.btn }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td align="left" style={styles.tableTd}>
                                          <table
                                            role="presentation"
                                            border="0"
                                            cellPadding="0"
                                            cellSpacing="0"
                                            style={styles.btnTable}
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style={
                                                    styles.btnPrimaryTableTd
                                                  }
                                                >
                                                  <a
                                                    href={`${CLIENT_URL}${
                                                      url.split("/")[-1]
                                                    }`}
                                                    target="_blank"
                                                    style={{
                                                      ...styles.btnLink,
                                                      ...styles.btnPrimaryLink,
                                                    }}
                                                  >
                                                    Upload user photo
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p style={styles.p}>
                                    If you need any help with booking your next
                                    tour, please don&apos;t hesitate to contact
                                    me!
                                  </p>
                                  <p style={styles.p}>- Josip Čunko</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* START FOOTER */}
                  <div className="footer" style={styles.footer}>
                    <table
                      role="presentation"
                      border="0"
                      cellPadding="0"
                      cellSpacing="0"
                      style={styles.table}
                    >
                      <tbody>
                        <tr>
                          <td
                            className="content-block"
                            style={{
                              ...styles.tableTd,
                              ...styles.contentBlock,
                              ...styles.footerText,
                            }}
                          >
                            <span className="apple-link">
                              Natours Inc, 123 Nowhere Road, San Francisco CA
                              99999
                            </span>
                            <br />
                            Don&apos;t like these emails?{" "}
                            <a href="#" style={styles.a}>
                              Unsubscribe
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
