import ExpoSQLiteDialect from '@expo/knex-expo-sqlite-dialect';
import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import Knex from 'knex';

interface Item {
  id: number;
  done: boolean;
  value: string;
}

const knex = Knex({
  client: ExpoSQLiteDialect,
  connection: {
    filename: 'test.db',
  },
  useNullAsDefault: true,
});

function Items({
  done: doneHeading,
  onPressItem,
}: {
  done: boolean;
  onPressItem: (id: number) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function setup() {
      const hasTable = await knex.schema.hasTable('items');
      if (hasTable) {
        const rows = await knex<Item>('items')
          .select()
          .where({ done: doneHeading });
        setItems(rows);
      }
    }
    setup();
  }, []);

  const heading = doneHeading ? 'Completed' : 'Todo';

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={{
            backgroundColor: done ? '#1c9963' : '#fff',
            borderColor: '#000',
            borderWidth: 1,
            padding: 8,
          }}
        >
          <Text style={{ color: done ? '#fff' : '#000' }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    async function setup() {
      const hasTable = await knex.schema.hasTable('items');
      if (!hasTable) {
        await knex.schema.createTable('items', (table) => {
          table.increments('id');
          table.boolean('done').defaultTo(false);
          table.string('value');
        });
      }
    }
    async function teardown() {
      await knex.destroy();
    }

    setup();
    return () => {
      teardown();
    };
  }, []);

  async function add(text: string) {
    // is text empty?
    if (text === null || text === '') {
      return false;
    }

    await knex('items').insert({ done: false, value: text });
    const items = await knex('items').select();
    console.log(JSON.stringify(items));
    forceUpdate();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SQLite Example</Text>

      <>
        <View style={styles.flexRow}>
          <TextInput
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => {
              add(text);
              setText(null);
            }}
            placeholder="what do you need to do?"
            style={styles.input}
            value={text}
          />
        </View>
        <ScrollView style={styles.listArea}>
          <Items
            key={`forceupdate-todo-${forceUpdateId}`}
            done={false}
            onPressItem={async (id) => {
              await knex('items').update({ done: true }).where({ id });
              forceUpdate();
            }}
          />
          <Items
            done
            key={`forceupdate-done-${forceUpdateId}`}
            onPressItem={async (id) => {
              await knex('items').delete().where({ id });
              forceUpdate();
            }}
          />
        </ScrollView>
      </>
    </View>
  );
}

function useForceUpdate(): [() => void, number] {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    borderColor: '#4630eb',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});
