import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  formatAlarm,
  formatAltitude,
  formatBoolean,
  formatCoordinate,
  formatCourse,
  formatDistance,
  formatNumber,
  formatNumericHours,
  formatPercentage,
  formatSpeed,
  formatTime,
  formatTemperature,
  formatVoltage,
  formatVolume,
  formatConsumption,
} from '../util/formatter';
import { useAttributePreference, usePreference } from '../util/preferences';
import { useTranslation } from './LocalizationProvider';
import { useAdministrator } from '../util/permissions';
import { toJson } from '../util/converter';
import AddressValue from './AddressValue';
import GeofencesValue from './GeofencesValue';

const PositionValue = ({ position, property, attribute }) => {
  const t = useTranslation();

  const theme = useTheme();

  const admin = useAdministrator();

  const device = useSelector((state) => state.devices.items[position.deviceId]);

  let key;
  let value;

  // Attribute
  if (!property) {
    if (attribute.includes(':')) {
      const parts = attribute.split(':');
      // TODO: change
      key = parts[parts.length - 1];
      value = JSON.parse(position.attributes[parts.shift()]);
      parts.forEach((part) => value = value[part]);
    // Base value for normal attributes
    } else {
      key = attribute;
      value = position.attributes[attribute];
    }

    // Convert value to json if possible
    value = toJson(value);

    // Visualise parent objects with the 'Array' type
    if (Array.isArray(value)) {
      value = 'Array';
    // Visualize parent objects with the 'Object' type
    } else if ((value != null && typeof value === 'object')) {
      value = 'Object';
    }
  // Property
  } else {
    key = property;
    value = position[property];
  }

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');
  const coordinateFormat = usePreference('coordinateFormat');
  const hours12 = usePreference('twelveHourFormat');

  const formatValue = () => {
    switch (key) {
      case 'fixTime':
      case 'deviceTime':
      case 'serverTime':
        return formatTime(value, 'seconds', hours12);
      case 'latitude':
        return formatCoordinate('latitude', value, coordinateFormat);
      case 'longitude':
        return formatCoordinate('longitude', value, coordinateFormat);
      case 'speed':
      case 'obdSpeed':
        return value != null ? formatSpeed(value, speedUnit, t) : '';
      case 'course':
        return formatCourse(value);
      case 'altitude':
        return formatAltitude(value, altitudeUnit, t);
      case 'power':
      case 'battery':
        return formatVoltage(value, t);
      case 'batteryLevel':
        return value != null ? formatPercentage(value, t) : '';
      case 'volume':
        return value != null ? formatVolume(value, volumeUnit, t) : '';
      case 'fuelConsumption':
        return value != null ? formatConsumption(value, t) : '';
      case 'coolantTemp':
        return formatTemperature(value);
      case 'alarm':
        return formatAlarm(value, t);
      case 'odometer':
      case 'serviceOdometer':
      case 'tripOdometer':
      case 'obdOdometer':
      case 'distance':
      case 'totalDistance':
        return value != null ? formatDistance(value, distanceUnit, t) : '';
      case 'hours':
        return value != null ? formatNumericHours(value, t) : '';
      default:
        if (typeof value === 'number') {
          return formatNumber(value);
        }
        if (typeof value === 'boolean') {
          return formatBoolean(value, t);
        }
        return value || 'null';
    }
  };

  switch (key) {
    case 'image':
    case 'video':
    case 'audio':
      return (<Link href={`/api/media/${device.uniqueId}/${value}`} target="_blank">{value}</Link>);
    case 'totalDistance':
    case 'hours':
      return (
        <>
          {formatValue(value)}
          &nbsp;&nbsp;
          {admin && (<Link component={RouterLink} underline="none" to={`/settings/accumulators/${position.deviceId}`}>&#9881;</Link>)}
        </>
      );
    case 'address':
      return (<AddressValue latitude={position.latitude} longitude={position.longitude} originalAddress={value} />);
    case 'network':
      if (value) {
        return (<Link component={RouterLink} underline="none" to={`/network/${position.id}`}>{t('sharedInfoTitle')}</Link>);
      }
      return '';
    case 'geofenceIds':
      if (value) {
        return (<GeofencesValue geofenceIds={value} />);
      }
      return '';
    default:
      if (value === null) {
        return (
          <Typography color={theme.palette.error.main}>
            {formatValue(value)}
          </Typography>
        );
      }
      if (value === 'Object' || value === 'Array') {
        return (
          <strong>
            {formatValue(value)}
          </strong>
        );
      }
      return formatValue(value);
  }
};

export default PositionValue;
