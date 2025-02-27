const React = require("react");

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
  return /*#__PURE__*/ React.createElement(
    "html",
    null,
    /*#__PURE__*/ React.createElement(
      "head",
      null,
      /*#__PURE__*/ React.createElement("meta", {
        name: "viewport",
        content: "width=device-width",
      }),
      /*#__PURE__*/ React.createElement("meta", {
        httpEquiv: "Content-Type",
        content: "text/html; charset=UTF-8",
      }),
      /*#__PURE__*/ React.createElement("title", null, subject)
    ),
    /*#__PURE__*/ React.createElement(
      "body",
      {
        style: styles.body,
      },
      /*#__PURE__*/ React.createElement(
        "table",
        {
          role: "presentation",
          border: "0",
          cellPadding: "0",
          cellSpacing: "0",
          style: styles.table,
          className: "body",
        },
        /*#__PURE__*/ React.createElement(
          "tbody",
          null,
          /*#__PURE__*/ React.createElement(
            "tr",
            null,
            /*#__PURE__*/ React.createElement("td", null),
            /*#__PURE__*/ React.createElement(
              "td",
              {
                className: "container",
                style: styles.container,
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "content",
                  style: styles.content,
                },
                /*#__PURE__*/ React.createElement(
                  "table",
                  {
                    role: "presentation",
                    className: "main",
                    style: styles.main,
                  },
                  /*#__PURE__*/ React.createElement(
                    "tbody",
                    null,
                    /*#__PURE__*/ React.createElement(
                      "tr",
                      null,
                      /*#__PURE__*/ React.createElement(
                        "td",
                        {
                          className: "wrapper",
                          style: styles.wrapper,
                        },
                        /*#__PURE__*/ React.createElement(
                          "table",
                          {
                            role: "presentation",
                            border: "0",
                            cellPadding: "0",
                            cellSpacing: "0",
                            style: styles.table,
                          },
                          /*#__PURE__*/ React.createElement(
                            "tbody",
                            null,
                            /*#__PURE__*/ React.createElement(
                              "tr",
                              null,
                              /*#__PURE__*/ React.createElement(
                                "td",
                                {
                                  style: styles.tableTd,
                                },
                                /*#__PURE__*/ React.createElement(
                                  "p",
                                  {
                                    style: styles.p,
                                  },
                                  "Hi ",
                                  name,
                                  ","
                                ),
                                /*#__PURE__*/ React.createElement(
                                  "p",
                                  {
                                    style: styles.p,
                                  },
                                  "Welcome to Natours, we're glad to have you \uD83C\uDF89\uD83D\uDE4F"
                                ),
                                /*#__PURE__*/ React.createElement(
                                  "p",
                                  {
                                    style: styles.p,
                                  },
                                  "We're all a big familiy here, so make sure to upload your user photo so we get to know you a bit better!"
                                ),
                                /*#__PURE__*/ React.createElement(
                                  "table",
                                  {
                                    role: "presentation",
                                    border: "0",
                                    cellPadding: "0",
                                    cellSpacing: "0",
                                    className: "btn btn-primary",
                                    style: {
                                      ...styles.table,
                                      ...styles.btn,
                                    },
                                  },
                                  /*#__PURE__*/ React.createElement(
                                    "tbody",
                                    null,
                                    /*#__PURE__*/ React.createElement(
                                      "tr",
                                      null,
                                      /*#__PURE__*/ React.createElement(
                                        "td",
                                        {
                                          align: "left",
                                          style: styles.tableTd,
                                        },
                                        /*#__PURE__*/ React.createElement(
                                          "table",
                                          {
                                            role: "presentation",
                                            border: "0",
                                            cellPadding: "0",
                                            cellSpacing: "0",
                                            style: styles.btnTable,
                                          },
                                          /*#__PURE__*/ React.createElement(
                                            "tbody",
                                            null,
                                            /*#__PURE__*/ React.createElement(
                                              "tr",
                                              null,
                                              /*#__PURE__*/ React.createElement(
                                                "td",
                                                {
                                                  style:
                                                    styles.btnPrimaryTableTd,
                                                },
                                                /*#__PURE__*/ React.createElement(
                                                  "a",
                                                  {
                                                    href: url,
                                                    target: "_blank",
                                                    style: {
                                                      ...styles.btnLink,
                                                      ...styles.btnPrimaryLink,
                                                    },
                                                  },
                                                  "Upload user photo"
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                ),
                                /*#__PURE__*/ React.createElement(
                                  "p",
                                  {
                                    style: styles.p,
                                  },
                                  "If you need any help with booking your next tour, please don't hesitate to contact me!"
                                ),
                                /*#__PURE__*/ React.createElement(
                                  "p",
                                  {
                                    style: styles.p,
                                  },
                                  "- Jonas Schmedtmann, CEO"
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                ),
                /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    className: "footer",
                    style: styles.footer,
                  },
                  /*#__PURE__*/ React.createElement(
                    "table",
                    {
                      role: "presentation",
                      border: "0",
                      cellPadding: "0",
                      cellSpacing: "0",
                      style: styles.table,
                    },
                    /*#__PURE__*/ React.createElement(
                      "tbody",
                      null,
                      /*#__PURE__*/ React.createElement(
                        "tr",
                        null,
                        /*#__PURE__*/ React.createElement(
                          "td",
                          {
                            className: "content-block",
                            style: {
                              ...styles.tableTd,
                              ...styles.contentBlock,
                              ...styles.footerText,
                            },
                          },
                          /*#__PURE__*/ React.createElement(
                            "span",
                            {
                              className: "apple-link",
                            },
                            "Natours Inc, 123 Nowhere Road, San Francisco CA 99999"
                          ),
                          /*#__PURE__*/ React.createElement("br", null),
                          "Don't like these emails?",
                          " ",
                          /*#__PURE__*/ React.createElement(
                            "a",
                            {
                              href: "#",
                              style: styles.a,
                            },
                            "Unsubscribe"
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};
