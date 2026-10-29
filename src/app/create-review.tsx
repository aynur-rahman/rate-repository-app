import RequireAuth from '../components/RequireAuth';
import CreateReview from '../components/CreateReview';
export default function Screen() { return <RequireAuth><CreateReview /></RequireAuth>; }
