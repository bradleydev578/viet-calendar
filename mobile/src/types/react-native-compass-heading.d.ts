declare module 'react-native-compass-heading' {
  interface CompassHeadingData {
    heading: number;
    accuracy: number;
  }

  type CompassHeadingCallback = (data: CompassHeadingData) => void;

  const CompassHeading: {
    start: (degreeUpdateRate: number, callback: CompassHeadingCallback) => void;
    stop: () => void;
  };

  export default CompassHeading;
}
