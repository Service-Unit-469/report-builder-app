<script>
  import { query } from "../stores";
  export let fields;

  const operators = [
    {
      label: "Equals",
      value: "==",
    },
    {
      label: "Not Equals",
      value: "!=",
    },
    {
      label: "Contains",
      value: "~=",
    },
    {
      label: "Less Than",
      value: "<",
    },
    {
      label: "Less Than or Equals",
      value: "<=",
    },
    {
      label: "Greater Than",
      value: ">",
    },
    {
      label: "Greater Than or Equals",
      value: ">=",
    },
  ];
  let negate = false;
  let parameters = [{}];
  let join = "and";

  function addParameter() {
    parameters = parameters.concat({});
  }
  function removeParameter(parameter) {
    parameters = parameters.filter((cur) => cur !== parameter);
  }
  function calculateQuery() {
    let calculated = parameters
      .map((p) => `${p.field} ${p.operator} "${p.value}"`)
      .join(` ${join} `);
    if (negate) {
      calculated = `not (${calculated})`;
    }
    query.set(calculated);
  }
</script>

{#if fields}
  {#each Array.from(Object.keys(fields)).sort() as fieldId}
    <datalist id={`${fieldId}-values`}>
      {#each fields[fieldId].values as value}
        <option>{value}</option>
      {/each}
    </datalist>
  {/each}
{/if}

<div class="flex-inline">
  <div class="field-group">
    <label for="parameters">Parameters</label>
    {#each parameters as parameter}
      <div class="field-group inline-flex" id="parameters">
        <select
          type="text"
          id="field"
          bind:value={parameter.field}
          placeholder="Field"
          on:change={calculateQuery}
        >
          {#if fields}
            {#each Array.from(Object.keys(fields)).sort() as fieldId}
              <option value={fieldId}>{fields[fieldId].label}</option>
            {/each}
          {/if}
        </select>
        <select
          id="operator"
          bind:value={parameter.operator}
          on:change={calculateQuery}
        >
          {#each operators as operator}
            <option value={operator.value}>{operator.label}</option>
          {/each}
        </select>
        <input
          type="text"
          id="value"
          bind:value={parameter.value}
          placeholder="Value"
          list={`${parameter.field}-values`}
          on:change={calculateQuery}
        />
        <button
          on:click={() => {
            removeParameter(parameter);
            calculateQuery();
          }}>-</button
        >
      </div>
    {/each}
    <div class="field-group">
      <button on:click={addParameter}>+</button>
    </div>
  </div>

  <div class="field-group">
    <select id="joining" bind:value={join} on:change={calculateQuery}>
      <option>and</option>
      <option>or</option>
    </select>
    <label>
      <input type="checkbox" bind:checked={negate} on:change={calculateQuery} />
      Negate
    </label>
  </div>
</div>

<style>
  .flex-inline {
    justify-content: start;
    align-items: flex-start;
  }
  .flex-inline > .field-group {
    padding-right: 1em;
  }
</style>
