import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CssBaseline, Typography } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { getLigaturesFromBuffer } from "../dist";
import styled from "styled-components";
import GithubCorner from "react-github-corner";

const StyledFont = styled.div`
  @font-face {
    font-family: UploadedFont;
    src: url(${(props) => props.font});
  }

  font-family: UploadedFont;
  display: flex;
  flex-wrap: wrap;
`;

const StyledPreview = styled.div`
  width: 100px;
  background-color: #ddd;
  display: flex;
  flex-direction: column;
  justify-content: centered;
  align-items: center;
  margin: 8px;
  padding: 8px;
`;

const App = () => {
  const [fontBase64, setFontBase64] = useState(null);
  const [ligatures, setLigatures] = useState([]);
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <CssBaseline />
      <GithubCorner href="https://github.com/petermikitsh/ligatures" />
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        style={{ marginTop: "16px" }}
      >
        Ligatures
      </Typography>
      <DropzoneArea
        acceptedFiles={[".dfont,.otf,.ttc,.ttf,.woff,.woff2"]}
        filesLimit={1}
        onChange={([file]) => {
          if (!file) {
            return;
          }
          const readerBase64 = new FileReader();
          readerBase64.readAsDataURL(file);
          readerBase64.onload = () => setFontBase64(readerBase64.result);

          const readerArrayBuffer = new FileReader();
          readerArrayBuffer.readAsArrayBuffer(file);
          readerArrayBuffer.onload = () => {
            const fontBuffer = Buffer.from(readerArrayBuffer.result);
            setLigatures(getLigaturesFromBuffer(fontBuffer).sort());
          };
        }}
        dropzoneText={
          <span>
            <Typography>Drop your font file</Typography>
            <Typography variant="caption">
              <p>Files are not uploaded to server</p>
              <p>Supported formats: dfont, otf, ttc, ttf, woff, woff2</p>
            </Typography>
          </span>
        }
        showPreviewsInDropzone={false}
      />
      {fontBase64 && (
        <StyledFont font={fontBase64}>
          {ligatures.map((ligature) => (
            <StyledPreview key={ligature}>
              <div style={{ padding: "16px", fontSize: "32px" }}>
                {ligature}
              </div>
              <Typography
                component="div"
                variant="caption"
                style={{
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {ligature}
              </Typography>
            </StyledPreview>
          ))}
        </StyledFont>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
