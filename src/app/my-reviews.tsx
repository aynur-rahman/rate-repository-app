import RequireAuth from '../components/RequireAuth';
import MyReviews from '../components/MyReviews';
export default function Screen() { return <RequireAuth><MyReviews /></RequireAuth>; }
