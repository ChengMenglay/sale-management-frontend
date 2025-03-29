"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
export default function BarcodeCell({ barcode }: { barcode: string }) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barcode, {
        format: "CODE128",
        displayValue: false,
        height: 20,
      });
    }
  }, [barcode]);
  return <svg ref={barcodeRef}></svg>;
}
