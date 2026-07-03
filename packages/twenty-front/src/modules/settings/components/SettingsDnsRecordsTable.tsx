import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { capitalize, isDefined } from 'twenty-shared/utils';
import { Status } from 'twenty-ui/data-display';
import { type ThemeColor } from 'twenty-ui/theme';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type DnsRecord = {
  type: string;
  key: string;
  value: string;
  priority?: number | null;
  ttl?: string;
  status?: string;
  statusColor?: ThemeColor;
};

type SettingsDnsRecordsTableProps = {
  records: DnsRecord[];
};

const StyledRecordTableRow = styled(TableRow)`
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const SettingsDnsRecordsTable = ({
  records,
}: SettingsDnsRecordsTableProps) => {
  if (records.length === 0) {
    return null;
  }

  const hasPriorityColumn = records.some((record) =>
    isDefined(record.priority),
  );
  const hasTtlColumn = records.some((record) => isDefined(record.ttl));
  const hasStatusColumn = records.some((record) => isDefined(record.status));

  const gridAutoColumns = [
    '100px',
    'minmax(0, 1fr)',
    'minmax(0, 1.5fr)',
    ...(hasPriorityColumn ? ['max-content'] : []),
    ...(hasTtlColumn ? ['max-content'] : []),
    ...(hasStatusColumn ? ['max-content'] : []),
  ].join(' ');

  return (
    <Table>
      <TableRow gridAutoColumns={gridAutoColumns}>
        <TableHeader>{t`Type`}</TableHeader>
        <TableHeader>{t`Name`}</TableHeader>
        <TableHeader>{t`Value`}</TableHeader>
        {hasPriorityColumn && (
          <TableHeader align="center">{t`Priority`}</TableHeader>
        )}
        {hasTtlColumn && <TableHeader align="center">{t`TTL`}</TableHeader>}
        {hasStatusColumn && (
          <TableHeader align="center">{t`Status`}</TableHeader>
        )}
      </TableRow>

      {records.map((record, index) => (
        <StyledRecordTableRow
          key={record.value}
          gridAutoColumns={gridAutoColumns}
        >
          <TableCell>
            <SettingsTextInput
              instanceId={`dns-record-type-${index}`}
              value={record.type}
              sizeVariant="sm"
              disabled
              fullWidth
            />
          </TableCell>
          <TableCell>
            <SettingsTextInput
              instanceId={`dns-record-name-${index}`}
              value={record.key}
              sizeVariant="sm"
              disabled
              fullWidth
            />
          </TableCell>
          <TableCell>
            <SettingsTextInput
              instanceId={`dns-record-value-${index}`}
              value={record.value}
              sizeVariant="sm"
              disabled
              fullWidth
            />
          </TableCell>
          {hasPriorityColumn && (
            <TableCell align="center">{record.priority}</TableCell>
          )}
          {hasTtlColumn && <TableCell align="center">{record.ttl}</TableCell>}
          {hasStatusColumn && (
            <TableCell align="center">
              {isDefined(record.status) && isDefined(record.statusColor) && (
                <Status
                  color={record.statusColor}
                  text={capitalize(record.status)}
                />
              )}
            </TableCell>
          )}
        </StyledRecordTableRow>
      ))}
    </Table>
  );
};
