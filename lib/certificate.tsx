import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2",
      fontWeight: 900,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    padding: 0,
  },
  // Bordure décorative
  borderTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#0A2342",
  },
  borderBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#E8861A",
  },
  borderLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
    backgroundColor: "#0A2342",
  },
  borderRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    backgroundColor: "#E8861A",
  },
  // Contenu
  content: {
    margin: 40,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  // Header
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 900,
    color: "#0A2342",
    letterSpacing: 2,
  },
  brandAccent: {
    color: "#E8861A",
  },
  brandTagline: {
    fontSize: 9,
    color: "#666",
    letterSpacing: 3,
    marginTop: 4,
    textTransform: "uppercase",
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#E8861A",
    marginVertical: 20,
  },
  // Titre certificat
  certTitle: {
    fontSize: 13,
    color: "#666",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  certOf: {
    fontSize: 11,
    color: "#999",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  // Nom du bénéficiaire
  recipientLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 32,
    fontWeight: 900,
    color: "#0A2342",
    marginBottom: 20,
  },
  completionText: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 420,
    marginBottom: 8,
  },
  // Nom formation
  formationName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#E8861A",
    textAlign: "center",
    marginVertical: 16,
    maxWidth: 440,
  },
  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderTopStyle: "solid",
  },
  footerLeft: {
    alignItems: "flex-start",
  },
  footerRight: {
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 8,
    color: "#999",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 10,
    color: "#333",
    fontWeight: 700,
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 4,
  },
  // Numéro certificat
  certNumber: {
    fontSize: 8,
    color: "#bbb",
    marginTop: 16,
    letterSpacing: 1,
  },
});

interface CertificateProps {
  studentName: string;
  formationTitle: string;
  instructorName: string;
  completionDate: string;
  certificateNumber: string;
}

export function CertificateDocument({
  studentName,
  formationTitle,
  instructorName,
  completionDate,
  certificateNumber,
}: CertificateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Bordures décoratives */}
        <View style={styles.borderTop} />
        <View style={styles.borderBottom} />
        <View style={styles.borderLeft} />
        <View style={styles.borderRight} />

        {/* Contenu principal */}
        <View style={styles.content}>
          {/* Logo WAYS */}
          <View style={styles.header}>
            <Text style={styles.brandName}>
              <Text>WAYS </Text>
              <Text style={styles.brandAccent}>Academy</Text>
            </Text>
            <Text style={styles.brandTagline}>We Act for Your Success</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.certTitle}>Certificat</Text>
          <Text style={styles.certOf}>de réussite</Text>

          <Text style={styles.recipientLabel}>Ce certificat est décerné à</Text>
          <Text style={styles.recipientName}>{studentName}</Text>

          <Text style={styles.completionText}>
            pour avoir suivi et réussi avec succès la formation
          </Text>

          <Text style={styles.formationName}>{formationTitle}</Text>

          <Text style={styles.completionText}>
            dispensée par WAYS Digital Solutions
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Date de délivrance</Text>
              <Text style={styles.footerValue}>{completionDate}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={styles.certNumber}>N° {certificateNumber}</Text>
            </View>

            <View style={styles.footerRight}>
              <View style={styles.signatureLine} />
              <Text style={styles.footerLabel}>Instructeur</Text>
              <Text style={styles.footerValue}>{instructorName}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
