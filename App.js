/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// React and React Native
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

// Other Packages
import Realm from 'realm';
import RNFS from 'react-native-fs';
import UUIDGenerator from 'react-native-uuid-generator';

// Nested Components
import CustomerList from './components/CustomerList';
import Form from './components/Form';
import Header from './components/Header';
import Share from './components/Share';
import Loading from './components/Loading';

console.disableYellowBox = true;

const App = () => {
  // States
  const [realm, setRealm] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(false);

  // Init
  const path =
    RNFS.DocumentDirectoryPath + '/../../../../../Downloads/customers.csv';

  // OnLoad
  useEffect(() => {
    Realm.open({
      schema: [
        {
          name: 'Customer',
          properties: {id: 'string', name: 'string', tel: 'string'},
        },
      ],
    }).then(realm => {
      setCustomers(realm.objects('Customer'));
      setRealm(realm);
    });
    return () => {
      // Cleanup
      if (realm !== null && !realm.isClosed) {
        realm.close();
      }
    };
  }, []);

  // ****************************
  // Helpers/Validators
  // ****************************
  const isValid = () => {
    let exceptions = '';
    if (name.length === 0) {
      exceptions += 'Name is required\n';
    }
    if (tel.length !== 10) {
      exceptions += 'Tel. must be 10 digits';
    }

    if (exceptions.length === 0) return true;
    else return exceptions;
  };

  // ****************************
  // CRUD
  // ****************************
  const addCustomer = () => {
    const response = isValid();
    if (response === true) {
      if (editId.length > 0) {
        // If the customer details were being edited
        realm.write(() => {
          let customer = realm
            .objects('Customer')
            .find(customer => customer.id === editId);
          customer.name = name;
          customer.tel = tel;
        });
        setEditId('');
        setCustomers(realm.objects('Customer'));
      } else {
        // If a new customer is being created
        UUIDGenerator.getRandomUUID().then(uuid => {
          realm.write(() => {
            realm.create('Customer', {
              id: uuid,
              name: name,
              tel: tel,
            });
          });
          setCustomers(realm.objects('Customer'));
        });
      }

      // Reset form fields
      setName('');
      setTel('');
    } else {
      Alert.alert(response);
    }
  };

  const editCustomer = customer => {
    // Set form fields for editing customer details
    setEditId(customer.id);
    setName(customer.name);
    setTel(customer.tel);
  };

  const deleteCustomer = id => {
    realm.write(() => {
      realm.delete(
        realm.objects('Customer').find(customer => customer.id === id),
      );
    });
    setCustomers(realm.objects('Customer'));
  };

  const truncate = () => {
    setCustomers([]);
    realm.write(() => {
      realm.delete(realm.objects('Customer'));
    });
  };

  // ****************************
  // Data migration & sharing
  // ****************************
  const exportData = () => {
    // Prepare .csv content
    let csvContent = 'id,name,tel\n';
    customers.forEach(e => (csvContent += `${e.id},${e.name},${e.tel}\n`));

    // console.log(csvContent);

    // Write to file
    RNFS.writeFile(path, csvContent, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
        Alert.alert('Done!');
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert('Something went wrong');
      });
  };

  const exportDataToOffice = () => {
    setLoading(true);

    // API endpoint for sending email
    const uploadUrl = 'https://pratt.wmdd4950.com/managepetrotask/email';

    // File details
    var files = [
      {
        name: 'customers',
        filename: 'customers.csv',
        filepath: path,
        filetype: 'text/csv',
      },
    ];

    // Upload status handlers
    var uploadBegin = response => {
      var jobId = response.jobId;
      console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    var uploadProgress = response => {
      var percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
      );
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    // Upload file and send email
    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      fields: {},
      begin: uploadBegin,
      progress: uploadProgress,
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          Alert.alert("You've got mail!");
        } else {
          Alert.alert("Couldn't send email");
        }
      })
      .catch(err => {
        if (err.description === 'cancelled') {
          // cancelled by user
        }
        console.log(err);
        Alert.alert("Couldn't send email");
      })
      .finally(() => setLoading(false));
  };

  const importData = () => {
    // console.log('MainBundlePath', RNFS.MainBundlePath);
    console.log('CachesDirectoryPath', RNFS.CachesDirectoryPath);
    // console.log('DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
    // console.log('TemporaryDirectoryPath', RNFS.TemporaryDirectoryPath);
    // console.log('LibraryDirectoryPath', RNFS.LibraryDirectoryPath);
    RNFS.readFile(path, 'utf8')
      .then(contents => {
        // Clear Realm and state data
        truncate();

        // Read rows and create new records in Realm
        contents.split('\n').forEach(row => {
          const cells = row.split(',');
          if (cells[0].length > 0 && cells[0] !== 'id') {
            realm.write(() => {
              realm.create('Customer', {
                id: cells[0],
                name: cells[1],
                tel: cells[2],
              });
            });
          }
        });

        setCustomers(realm.objects('Customer'));

        Alert.alert('Done!');
      })
      .catch(err => {
        console.log(err.message, err.code);
        Alert.alert('No file found');
      });
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scontentContainerStyle={styles.scrollView}>
        <Header />

        {/* Body */}
        <View style={styles.content}>
          <Form
            name={name}
            tel={tel}
            onNameChange={setName}
            onTelChange={setTel}
            onSubmit={addCustomer}
          />

          <CustomerList
            customers={customers}
            onEdit={editCustomer}
            onDelete={deleteCustomer}
          />
        </View>

        <Share
          onImport={importData}
          onExport={exportData}
          onExportToOffice={exportDataToOffice}
          onTruncate={truncate}
        />
        {loading === true && <Loading />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    borderBottomWidth: 3,
    paddingBottom: 50,
  },
  scrollView: {
    height: Dimensions.get('window').height,
    justifyContent: 'space-between',
  },
});

export default App;
