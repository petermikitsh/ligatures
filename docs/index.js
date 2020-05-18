import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CssBaseline, Typography, Card, CardContent } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { getLigaturesFromBuffer } from "../dist";
import styled from "styled-components";
import GithubCorner from "react-github-corner";

const StyledRoot = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-rendering: optimizeLegibility;
  [class^="DropzoneArea-dropZone"] {
    min-height: 0;
  }
`;

const StyledFont = styled.div`
  ${(props) =>
    props.font
      ? `
    @font-face {
      font-family: UploadedFont;
      src: url(${props.font});
    }
  `
      : ""}

  font-family: UploadedFont;
  display: flex;
  flex-wrap: wrap;
  font-feature-settings: "liga", "dlig", "calt", "ordn", "rlig";
`;

const StyledPreview = styled.div`
  width: 126px;
  background-color: #ddd;
  display: flex;
  flex-direction: column;
  justify-content: centered;
  align-items: center;
  margin: 8px;
  padding: 8px;
`;

const StyledLigatureLetter = styled.span`
  display: inline-flex;
  justify-content: center;
  margin: 0 2px 2px 0;
  background: #ccc;
  font-family: monospace;
  font-size: 12px;
  width: 11px;
`;

const App = () => {
  const [fontBase64, setFontBase64] = useState(null);
  const [ligatures, setLigatures] = useState([]);

  return (
    <StyledRoot>
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
            const ligaturesFromBuffer = getLigaturesFromBuffer(
              fontBuffer
            ).sort();
            setLigatures(ligaturesFromBuffer);
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
      {Boolean(fontBase64 && !ligatures.length) && (
        <Card style={{ marginTop: "16px" }}>
          <CardContent>No ligatures detected.</CardContent>
        </Card>
      )}
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
                {ligature.split("").map((character, index) => (
                  <StyledLigatureLetter key={character + index}>
                    {character}
                  </StyledLigatureLetter>
                ))}
              </Typography>
            </StyledPreview>
          ))}
        </StyledFont>
      )}
    </StyledRoot>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
