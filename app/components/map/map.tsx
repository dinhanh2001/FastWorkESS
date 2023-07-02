import * as React from "react"
import { StyleProp, View, ViewStyle, Text } from "react-native"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../theme"
import MapboxGL from '@react-native-mapbox-gl/maps';
// import { getDistanceFromLatLon } from "../../utils/gps";


const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

// const TEXT: TextStyle = {
//   fontFamily: typography.primary,
//   fontSize: 14,
//   color: color.primary,
// }

export interface MapProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  position?: Object
  onUpdate?(e: object): void
}

/**
 * Describe your component here
 */
export const Map = observer(function Map(props: MapProps) {
  const { style, position, onUpdate, ...rest } = props
  const styles = Object.assign({}, CONTAINER, style)
  MapboxGL.setAccessToken('sk.eyJ1IjoiaGFvbGVkYW5oIiwiYSI6ImNsNmQxOGZvZzA3dzkzY254eW9ybnFocHgifQ.oNFDKs7k1yXTf9aX-B9BIA');
  // MapboxGL.setWellKnownTileServer('maplibre')

  return (
    <View style={styles} {...rest}>
      <MapboxGL.MapView style={{flex:1}} >
        <MapboxGL.UserLocation androidRenderMode={"gps"} renderMode={"native"} visible={true} onUpdate={onUpdate}/>
        <MapboxGL.Camera centerCoordinate={[position['long'],position['lat']]} zoomLevel={11} />
        <MapboxGL.PointAnnotation
            key={`square-1`}
            id={`square-1`}
            // coordinate={[105,21]}
            coordinate={[position['long'],position['lat']]}
            anchor={{ x: 0, y: 0 }}
          >
          </MapboxGL.PointAnnotation>
          <MapboxGL.MarkerView id="mk" coordinate={[position['long'],position['lat']]} anchor={{ x: 0, y: 0 }}>
            <Text>
              {position['address']}
            </Text>
          </MapboxGL.MarkerView>
      </MapboxGL.MapView>

    </View>
  )
})
