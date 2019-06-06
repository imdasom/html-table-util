const TableUtil = (function() {
    function isNull(value) {
        return value == null;
    }
    function getSpanSizes(tr) {
        let count = 0;
        const colspans = new Array(tr.length);
        for (let i = 0; i < tr.length; i++) {
            count++;
            const finalNull = (i === tr.length - 1);
            const isNextNew = (!isNull(tr[i + 1]));
            if (finalNull || isNextNew) {
                const index = count > 1 ? i - (count - 1) : i;
                colspans[index] = count;
                count = 0;
            }
        }
        return colspans;
    }
    function getRows(trs, i) {
        const arr = [];
        trs.forEach((element) => {
            arr.push(element[i]);
        });
        return arr;
    }

    return {
        setHeader: function(columns, $table) {
            const $colgroup = document.createElement('colgroup');
            $table.insertAdjacentElement('afterbegin', $colgroup);

            const colgroups = columns[0];
            colgroups.forEach((element, index) => {
                const $col = document.createElement('col');
                $col.style.width = element + '%';
                $colgroup.appendChild($col);
            });

            const $thead = document.createElement('thead');
            $table.insertAdjacentElement('afterbegin', $thead);

            const headers = columns.slice(1);

            const colSpans = [];
            const colHeaders = headers;
            colHeaders.forEach((headers) => {
                const colSpanSizes = getSpanSizes(headers);
                colSpans.push(colSpanSizes);
            });

            const rowSpans = [];
            const rowHeaders = (function () {
                const rowHeaders = [];
                for (let col = 0; col < colHeaders[0].length; col++) {
                    rowHeaders.push(getRows(colHeaders, col));
                }
                return rowHeaders;
            })();
            rowHeaders.forEach((headers) => {
                const rowSpanSizes = getSpanSizes(headers);
                rowSpans.push(rowSpanSizes);
            });

            const trs = [];
            for (let row = 0; row < headers.length; row++) {
                const thObjList = [];
                for (let col = 0; col < headers[0].length;) {
                    const th = {};
                    th.text = headers[row][col];
                    th.colspan = colSpans[row][col];
                    th.rowspan = rowSpans[col][row];
                    thObjList.push(th);
                    const nextOffset = th.colspan > 1 ? (colSpans[row][col]) : 1;
                    col += nextOffset;
                }
                trs.push(thObjList);
            }

            for (let row = 0; row < trs.length; row++) {
                const $tr = document.createElement('tr');
                for (let col = 0; col < trs[row].length; col++) {
                    const th = trs[row][col];
                    if (isNull(th.colspan) || isNull(th.rowspan)) {
                        continue;
                    }
                    const $th = document.createElement('th');
                    $th.textContent = th.text;
                    $th.rowSpan = th.rowspan;
                    $th.colSpan = th.colspan;
                    $tr.append($th);
                }
                $thead.append($tr);
            }
        }
    };
})();