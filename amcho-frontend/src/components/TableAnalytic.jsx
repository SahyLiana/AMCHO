function TableAnalytic({ indicators, dataAnalytics }) {
  return (
    <table className="w-full table table-auto">
      <thead className="bg-slate-700 text-lg">
        <tr className="">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            Indicators
          </td>
          {indicators.map((indicator) => (
            <td key={indicator} className="p-2 border-r border-slate-600">
              {indicator}
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            Cocoa Price
          </td>
          {dataAnalytics &&
            dataAnalytics.cocoaPrice.map((cocoa) => (
              <td key={cocoa.year} className="p-2 border-r border-slate-600">
                {cocoa.price}
              </td>
            ))}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            Cocoa Price Change
          </td>
          {dataAnalytics &&
            dataAnalytics.cocoaPriceChange.map((cocoa) => (
              <td key={cocoa.year} className="p-2 border-r border-slate-600">
                <span className={cocoa.change < 0 && "text-red-500"}>
                  {cocoa.change}
                </span>
              </td>
            ))}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            Cocoa Price % Change
          </td>
          {dataAnalytics &&
            dataAnalytics.cocoaPriceChangePercentage.map((cocoa) => (
              <td key={cocoa.year} className="p-2 border-r border-slate-600">
                <span
                  className={cocoa.pricepercentchange < 0 && "text-red-500"}
                >
                  {cocoa.pricepercentchange}
                </span>
              </td>
            ))}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">PPI</td>

          {indicators.map((indicator) => {
            const match = dataAnalytics?.cocoaPPI?.find(
              (cocoa) => cocoa.year === indicator,
            );

            return (
              <td key={indicator} className="p-2 border-r border-slate-600">
                {match ? match.avgppi : "-"}
              </td>
            );
          })}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            PPI Change
          </td>
          {indicators.map((indicator) => {
            const match = dataAnalytics?.cocoaPPIChange?.find(
              (cocoa) => cocoa.year === indicator,
            );

            return (
              <td key={indicator} className="p-2 border-r border-slate-600">
                {match ? match.ppichange : "-"}
              </td>
            );
          })}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            PPI % Change
          </td>
          {indicators.map((indicator) => {
            const match = dataAnalytics?.cocoaPPIChangePercentage?.find(
              (cocoa) => cocoa.year === indicator,
            );

            return (
              <td key={indicator} className="p-2 border-r border-slate-600">
                {match ? match.ppichange : "-"}
              </td>
            );
          })}
        </tr>
        <tr className="border-b-[1px] border-slate-600">
          <td className="p-2 border-r border-slate-600 text-amber-500">
            PPI % Change Reference
          </td>
          {indicators.map((indicator) => {
            const match =
              dataAnalytics?.cocoaPPIChangeReferencePercentage?.find(
                (cocoa) => cocoa.year === indicator,
              );

            return (
              <td key={indicator} className="p-2 border-r border-slate-600">
                {match ? match.ppi_difference_percentage : "-"}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}

export default TableAnalytic;
