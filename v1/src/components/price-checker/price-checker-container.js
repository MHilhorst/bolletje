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
  getStrategies,
  setStrategyForOffers,
} from '../../utils/repricer';
import { notification, Statistic, Divider, Result, Button } from 'antd';

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
      loadingImport: false,
      selectedExistingOffers: [],
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
      console.log(offer);
      return {
        key: index,
        ean: offer.ean,
        strategyName: offer.strategy ? offer.strategy.strategy_name : null,
        productName: offer.product_title,
        datafeed: offer.strategy ? offer.strategy.datafeed_url : null,
        totalSellers: offer.total_sellers,
        currentPrice: offer.price,
        bestOffer: offer.best_offer_is_own_offer,
        incrementAmount: offer.repricer_increment,
        currentStock: offer.stock,
        minPrice: offer.min_price,
        purchaseCosts: Number(offer.purchase_price),
        shippingCosts: Number(offer.shipping_cost),
        liveTracking: offer.repricer_active,
        bolActive: offer.bol_active,
        id: offer._id,
        sync: this.props.user.csv.ean.find((a) => offer.ean === a)
          ? true
          : false,
      };
    });
    const strategiesData = await getStrategies();
    if (strategiesData.strategies) {
      this.setState({ strategies: strategiesData.strategies });
    }
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
    this.setState({ loadingImport: true });
    const data = await setSelectedOffers(this.state.selectedOffers);
    if (data.success) {
      this.setState({ loadingImport: false });
      window.location.reload();
    }
  };
  handleSelectedStrategy = (e) => {
    this.setState({ selectedStrategy: e });
  };

  updateOffersWithStrategy = async () => {
    const data = await setStrategyForOffers(
      this.state.selectedExistingOffers,
      this.state.selectedStrategy
    );
    if (data) {
      window.location.reload();
    }
  };

  openNotification = (type) => {
    notification[type]({
      message: 'Succesfully Updated',
      description: (
        <div>
          <span>
            You have succesfully updated the shipping cost and purchase price of
            the offer:
          </span>
          <br />
          <br />
          <span>{this.state.repricerOfferTitle}</span>
        </div>
      ),
    });
  };
  handleAddProductCostData = async () => {
    this.setState({ loadingUpdateProductDataCost: true });
    const data = await updateRepricerOffer(
      {
        purchasePrice: this.state.purchaseCosts,
        shippingCost: this.state.shippingCosts,
      },
      this.state.repricerOfferId
    );
    if (data.success) {
      console.log('success');
    }
    this.setState({
      loadingUpdateProductDataCost: false,
      showProductCostData: false,
    });
    this.openNotification('success');
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
      if (
        this.props.user.bol_client_id &&
        this.props.user.bol_client_secret &&
        this.props.user.bol_shop_name
      ) {
        return (
          <PriceCheckerView
            handleReloadOffers={this.handleReloadOffers}
            onChange={this.onChange}
            handleSubmit={this.handleSubmit}
            handleUpdateRepricerOffer={this.handleUpdateRepricerOffer}
            handleCommission={this.handleCommission}
            handleSetSelectedOffers={this.handleSetSelectedOffers}
            handleUploadUrl={this.handleUploadUrl}
            handleSelectedStrategy={this.handleSelectedStrategy}
            updateOffersWithStrategy={this.updateOffersWithStrategy}
            handleAddProductCostData={this.handleAddProductCostData}
            {...this.state}
            {...this.props}
          />
        );
      } else {
        return (
          <Result
            status="500"
            title="Missing Bol.com API credentials"
            subTitle="You need to fill in your Bol.com client ID and Bol.com client secret before you can use the Repricer tool."
            extra={
              <Button
                type="primary"
                onClick={() => this.props.history.push('/profile')}
              >
                Fill in Bol.com API credentials
              </Button>
            }
          />
        );
      }
    } else return null;
  }
}
