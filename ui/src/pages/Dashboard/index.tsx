import {Box, Card, CardHeader, Grid2, Stack} from '@mui/material';
import Header from '../../layouts/DefaultLayout/Header';

export default function Content() {
  return (
    <>
      <Header title="Dashboard" />
      <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
        <Stack>
          <Grid2 container spacing={2}>
            <Grid2 size={6}>
              <Card>
                <CardHeader title="15 Identities"/>
              </Card>
            </Grid2>
            <Grid2 size={6}>
              <Card>
                <CardHeader title="12 Hydra Clients"/>
              </Card>
            </Grid2>
          </Grid2>
        </Stack>
      </Box>
    </>
  );
}
