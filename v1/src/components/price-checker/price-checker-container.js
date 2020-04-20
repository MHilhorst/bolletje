import React from 'react';
import PriceCheckerView from './price-checker-view';
import {
  reloadOffers,
  getUserOwnOffers,
  getCommission,
  updateRepricerOffer,
  updateOffers,
  setSelectedOffers,
  setSpreadSheetImportUrl,
} from '../../utils/repricer';
import { notification, Statistic, Divider } from 'antd';

const { Countdown } = Statistic;
const openNotificationWithIcon = (type, success) => {
  console.log(type);
  notification[type]({
    message: success
      ? 'Je Import is succesvol doorgevoerd.'
      : 'Je import is mislukt.',
    description: (
      <span>
        De pagina wordt zometeen herladen met de nieuwste updates.
        <Divider />
        De pagina wordt ververst in :{' '}
        <Countdown
          format={'s'}
          value={Date.now() + 1000 * 5}
          valueStyle={{ fontSize: 14 }}
        />
      </span>
    ),
  });
};

export default class PriceCheckerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      loadingOffers: false,
      loading: true,
      tableOffers: [],
      repricerActive: 0,
      selectedOffers: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = async () => {
    await updateOffers();
  };

  handleUpdateRepricerOffer = async (id) => {
    let query = {};
    // if (this.state.repricerActive > 0)
    // query.repricerActive = this.state.repricerActive === 2 ? true : false;
    query.repricerActive = true;
    updateRepricerOffer(query, id);
  };

  async componentDidMount() {
    const data = await getUserOwnOffers();
    const offerTableSchema = data.offers.map((offer, index) => {
      return {
        key: index,
        ean: offer.ean,
        productName: offer.product_title,
        totalSellers: offer.total_sellers,
        currentPrice: offer.price,
        bestOffer: offer.best_offer,
        currentStock: offer.stock,
        minPrice: offer.min_price,
        liveTracking: offer.repricer_active,
        bolActive: offer.bol_active,
        id: offer._id,
        sync: offer.linked_to_spreadsheet,
      };
    });
    if (this.props.user.status.updates.length > 0) {
      const pendingOffer = this.props.user.status.updates
        .reverse()
        .findIndex((update) => {
          return update.status === 'PENDING';
        });
      if (pendingOffer !== -1) {
        this.setState({
          requestId: this.props.user.status.updates[pendingOffer].id,
        });
      } else {
        this.setState({ requestId: 'NEW' });
      }
      const sortedOfferExports = this.props.user.status.updates.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      this.setState({ sortedOfferExports });
    }
    this.setState({
      tableOffers: offerTableSchema,
      loadingOffers: this.props.user.status.loading_export_file,
      loading: false,
    });
  }

  handleCommission = async (ean, price, minListing) => {
    if (!minListing) {
      const commission = await getCommission(ean, price);
      this.setState({
        bolReceivePrice: commission.totalCost,
        bolCommissionPercentage: commission.percentage,
        commissionReduction: commission.hasOwnProperty('reductions')
          ? commission.reductions[0]
          : false,
      });
    } else {
      const commission = await getCommission(ean, price);
      this.setState({
        minListingCommission: commission.totalCost,
      });
    }
  };
  handleUploadUrl = async () => {
    if (this.state.url) {
      if (
        this.state.url.includes('pub?output=csv') &&
        this.state.url.includes('docs.google.com/spreadsheets/')
      ) {
        this.setState({ loadingCSVImport: true });
        const data = await setSpreadSheetImportUrl(this.state.url);
        if (data) {
          this.setState({
            loadingCSVImport: false,
            outputCsvError: false,
            noUrlError: false,
          });
          openNotificationWithIcon('success');
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } else {
        this.setState({ outputCsvError: true });
      }
    }
    if (!this.state.url && this.props.user.csv.url) {
      this.setState({ loadingCSVImport: true });
      const data = await setSpreadSheetImportUrl(this.props.user.csv.url);
      if (data) {
        this.setState({
          loadingCSVImport: false,
          outputCsvError: false,
          noUrlError: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
        openNotificationWithIcon('success');
      }
    }
  };

  handleSetSelectedOffers = async () => {
    const data = await setSelectedOffers(this.state.selectedOffers);
    console.log(data);
  };

  handleReloadOffers = async () => {
    let data;
    this.setState({ loadingOffers: true });
    if (this.state.requestId === 'NEW') {
      data = await reloadOffers(``);
    } else {
      data = await reloadOffers(`?requestId=${this.state.requestId}`);
    }
    if (data.error) {
      this.setState({ loadingOffers: false });
      openNotificationWithIcon('error', false);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
    if (data.limitExceeded) {
      const selectOffersData = data.offers.map((offer, index) => {
        return {
          key: index,
          ean: offer.ean,
          offerId: offer.offerId,
        };
      });
      this.setState({
        selectOffersModal: true,
        selectOffersData,
        loadingOffers: false,
      });
    }

    // if (offers.succes) {
    //   openNotificationWithIcon('success', true);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 5000);
    // } else {
    //   openNotificationWithIcon('error', false);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 5000);
    // }
    // this.setState({ loadingOffers: false });
  };

  render() {
    if (this.state.offers && this.state.tableOffers && !this.state.loading) {
      return (
        <PriceCheckerView
          handleReloadOffers={this.handleReloadOffers}
          onChange={this.onChange}
          handleSubmit={this.handleSubmit}
          handleUpdateRepricerOffer={this.handleUpdateRepricerOffer}
          handleCommission={this.handleCommission}
          handleSetSelectedOffers={this.handleSetSelectedOffers}
          handleUploadUrl={this.handleUploadUrl}
          {...this.state}
          {...this.props}
        />
      );
    } else return null;
  }
}
