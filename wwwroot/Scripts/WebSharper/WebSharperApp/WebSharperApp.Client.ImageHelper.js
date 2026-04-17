import { toInt } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
export function resizeImage(file, callback){
  const reader=new FileReader();
  reader.onload=() => {
    const img=new Image();
    img.onload=() => {
      const canvas=globalThis.document.createElement("canvas");
      let width=img.width;
      let height=img.height;
      const max=500;
      if(width>height)width>max?(height=height*(max/width),width=max):void 0;
      else height>max?(width=width*(max/height),height=max):void 0;
      canvas.width=toInt(width);
      canvas.height=toInt(height);
      canvas.getContext("2d");
      width;
      height;
      globalThis["arguments"][0].drawImage(globalThis["arguments"][1], 0, 0, globalThis["arguments"][2], globalThis["arguments"][3]);
      callback(canvas.toDataURL("image/jpeg"));
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}
