<script>
  import { searchQuery } from "../stores";
  export let fields;
  export let recentQueries;
</script>

<div class="field-group">
  <label for="query">Query</label>
  <textarea id="query" bind:value={$searchQuery} />
  <br />
  <details>
    <summary>Recent Queries</summary>
    <ul>
      {#each recentQueries as q}
        <li
          on:click={() => {
            searchQuery.set(q);
          }}
        >
          {q}
        </li>
      {/each}
    </ul>
  </details>
  <br />
  <details>
    <summary>Help</summary>
    <p>Queries are expressed in the form of:</p>
    <pre>[field] [comparison] [value]</pre>
    <p>for example:</p>
    <pre>First_Name == "Jane"</pre>
    <p>The following fields are available:</p>
    <ul>
      {#if fields}
        {#each Object.keys(fields) as field}
          <li>{field}</li>
        {/each}
      {/if}
    </ul>
    <table>
      <thead>
        <tr>
          <th>Values</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>43, -1.234</td>
          <td>Numbers</td>
        </tr>
        <tr>
          <td>&quot;hello&quot;</td>
          <td>String</td>
        </tr>
        <tr>
          <td>&quot; \&quot; \\ &quot;</td>
          <td>Escaping of double-quotes and blackslash in string</td>
        </tr>
        <tr>
          <td>foo, a.b.c, &#39;foo-bar&#39;</td>
          <td
            >External data variable defined by application (may be numbers or
            strings)</td
          >
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Numeric arithmetic</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>x + y</td>
          <td>Add</td>
        </tr>
        <tr>
          <td>x - y</td>
          <td>Subtract</td>
        </tr>
        <tr>
          <td>x * y</td>
          <td>Multiply</td>
        </tr>
        <tr>
          <td>x / y</td>
          <td>Divide</td>
        </tr>
        <tr>
          <td>x ^ y</td>
          <td>Power</td>
        </tr>
        <tr>
          <td>x mod y</td>
          <td>Modulo</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Comparisons</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>x == y</td>
          <td>Equals</td>
        </tr>
        <tr>
          <td>x != y</td>
          <td>Does not equal</td>
        </tr>
        <tr>
          <td>x &lt; y</td>
          <td>Less than</td>
        </tr>
        <tr>
          <td>x &lt;= y</td>
          <td>Less than or equal to</td>
        </tr>
        <tr>
          <td>x &gt; y</td>
          <td>Greater than</td>
        </tr>
        <tr>
          <td>x &gt;= y</td>
          <td>Greater than or equal to</td>
        </tr>
        <tr>
          <td>x == y &lt;= z</td>
          <td>Chained relation, equivalent to (x == y and y &lt;= z)</td>
        </tr>
        <tr>
          <td>x ~= y</td>
          <td>Regular expression match</td>
        </tr>
        <tr>
          <td>x in (a, b, c)</td>
          <td>Equivalent to (x == a or x == b or x == c)</td>
        </tr>
        <tr>
          <td>x not in (a, b, c)</td>
          <td>Equivalent to (x != a and x != b and x != c)</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Boolean logic</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>x or y</td>
          <td>Boolean or</td>
        </tr>
        <tr>
          <td>x and y</td>
          <td>Boolean and</td>
        </tr>
        <tr>
          <td>not x</td>
          <td>Boolean not</td>
        </tr>
        <tr>
          <td>if x then y else z</td>
          <td>If boolean x is true, return value y, else return z</td>
        </tr>
        <tr>
          <td>( x )</td>
          <td>Explicity operator precedence</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Objects and arrays</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>(a, b, c)</td>
          <td>Array</td>
        </tr>
        <tr>
          <td>a in b</td>
          <td>Array a is a subset of array b</td>
        </tr>
        <tr>
          <td>x of y</td>
          <td>Property x of object y</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Built-in functions</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>abs(x)</td>
          <td>Absolute value</td>
        </tr>
        <tr>
          <td>ceil(x)</td>
          <td>Round floating point up</td>
        </tr>
        <tr>
          <td>empty(x)</td>
          <td
            >True if <em>x</em> is <code>undefined</code>, <code>null</code>, an
            empty array or an empty string</td
          >
        </tr>
        <tr>
          <td>exists(x)</td>
          <td
            >True unless <em>x</em> is <code>undefined</code> or
            <code>null</code></td
          >
        </tr>
        <tr>
          <td>floor(x)</td>
          <td>Round floating point down</td>
        </tr>
        <tr>
          <td>log(x)</td>
          <td>Natural logarithm</td>
        </tr>
        <tr>
          <td>log2(x)</td>
          <td>Logarithm base two</td>
        </tr>
        <tr>
          <td>log10(x)</td>
          <td>Logarithm base ten</td>
        </tr>
        <tr>
          <td>max(a, b, c...)</td>
          <td>Max value (variable length of args)</td>
        </tr>
        <tr>
          <td>min(a, b, c...)</td>
          <td>Min value (variable length of args)</td>
        </tr>
        <tr>
          <td>round(x)</td>
          <td>Round floating point</td>
        </tr>
        <tr>
          <td>sqrt(x)</td>
          <td>Square root</td>
        </tr>
      </tbody>
    </table>
    <p>Operator precedence follows that of any sane language.</p>
  </details>
</div>

<style>
  textarea {
    width: 100%;
  }
</style>
