import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { UNEP_DATASET_ID } from '../../constants';
import type { ReefDatasetLayerProps } from './types';

export function ReefDatasetLayer({ selectedId, onSelectReef, onMapReady }: ReefDatasetLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (!map || !UNEP_DATASET_ID) return;

    let datasetLayer: google.maps.FeatureLayer;
    try {
      datasetLayer = map.getDatasetFeatureLayer(UNEP_DATASET_ID);
    } catch (err) {
      console.warn('Dataset layer not ready:', err);
      return;
    }

    datasetLayer.style = (options: google.maps.FeatureStyleFunctionOptions) => {
      const feature = options.feature as google.maps.DatasetFeature;
      const attrs = feature.datasetAttributes;
      const rawId = attrs['OBJECTID'] ?? attrs['objectid'];

      const isSelected = selectedId !== null && String(rawId) === String(selectedId);

      return {
        fillColor: isSelected ? '#f59e0b' : '#06b6d4',
        fillOpacity: isSelected ? 0.85 : 0.55,
        strokeColor: isSelected ? '#ffffff' : '#0891b2',
        strokeWeight: isSelected ? 2.5 : 1,
        strokeOpacity: 0.9,
      };
    };

    const clickListener = datasetLayer.addListener(
      'click',
      (event: google.maps.FeatureMouseEvent) => {
        if (!event.features || event.features.length === 0) return;

        const feature = event.features[0] as google.maps.DatasetFeature;
        const attrs = feature.datasetAttributes;
        const rawId = attrs['OBJECTID'] ?? attrs['objectid'];

        if (!rawId || !event.latLng) return;
        const cleanId = String(rawId).split('.')[0];

        onSelectReef({
          id: cleanId,
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          area: attrs['gis_area_k'],
          metadataId: attrs['metadata_i'],
        });
      }
    );

    return () => {
      datasetLayer.style = null;
      clickListener.remove();
    };
  }, [map, selectedId, onSelectReef]);

  return null;
}
