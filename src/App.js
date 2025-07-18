import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <textarea
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter shorthand title notes here..."
        style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
      />
      <button
        onClick={handleGenerate}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        Generate Title Note
      </button>
      <pre style={{ marginTop: "2rem", whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem", borderRadius: "5px" }}>
        {output}
      </pre>
    </div>
  );
}

function generateTitleNote(input) {
  const deedMap = {
    QCD: "Quit Claim Deed",
    MD: "Mineral Deed",
    AOGL: "Assignment of Oil and Gas Leases",
    DTO: "Drilling Title Opinion",
    DOTO: "Division Order Title Opinion",
    WD: "Warranty Deed",
    GWD: "General Warranty Deed",
    QCMD: "Quit Claim Mineral Deed",
    FD: "Final Decree"
  };

  const lines = input.trim().split("\n");
  let output = "";
  let foundExpired = false;
  let foundOverconvey = false;

  lines.forEach((line) => {
    const deedMatch = line.match(/(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)/);
    const bkpgMatch = line.match(/(\d{1,4})[\/\-\s](\d{1,4})/);
    const dateMatch = line.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
    const grantorMatch = line.match(/^(.*?)\s(conveyed|received)/i);
    const tractMatch = line.match(/Tract\s*(\d+)/i);

    const hasExpired = line.toLowerCase().includes("expired");
    const hasTerm = line.toLowerCase().includes("term");
    const hasNoProduction = line.toLowerCase().includes("no production");
    const overConvey = line.toLowerCase().includes("did not own") || line.toLowerCase().includes("didn't have");

    if (bkpgMatch && deedMatch && dateMatch) {
      const deedCode = deedMatch[1];
      const deedFull = deedMap[deedCode] || "Instrument";
      const [_, book, page] = bkpgMatch;
      const [__, mm, dd, yyyy] = dateMatch;
      const fullYear = yyyy.length === 2 ? (parseInt(yyyy) < 25 ? "20" + yyyy : "19" + yyyy) : yyyy;
      const formattedDate = new Date(`${fullYear}-${mm}-${dd}`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (grantorMatch && deedCode === "MD") {
        output += `${grantorMatch[1]} conveyed an undivided interest by Mineral Deed recorded in Book ${book}, Page ${page}, dated ${formattedDate}. `;
      } else if (grantorMatch && deedCode === "FD") {
        output += `${grantorMatch[1]} was referenced in a Final Decree recorded in Book ${book}, Page ${page}, dated ${formattedDate}. `;
      } else {
        output += `${deedFull} recorded in Book ${book}, Page ${page}, dated ${formattedDate}. `;
      }
    }

    if (hasTerm && hasExpired) {
      foundExpired = true;
      output += `The interest was term-limited and is believed to have expired. `;
    }

    if (hasNoProduction) {
      output += `No production has occurred in the subject area. `;
    }

    if (overConvey) {
      foundOverconvey = true;
      const tract = tractMatch ? ` affecting Tract ${tractMatch[1]}` : "";
      output += `However, field records indicate the grantor did not own the full interest at the time of conveyance, creating a potential over-conveyance issue${tract}. `;
    }
  });

  output += "\n\nFor the purposes of this report, the examiner has ";
  if (foundExpired) {
    output += "not credited any interest due to expiration of term interest.";
  } else if (foundOverconvey) {
    output += "credited the interest based on record instruments, subject to curative review.";
  } else {
    output += "credited the interest based on record instruments.";
  }

  return output.trim();
}

export default App;
